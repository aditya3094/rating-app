const User = require("../models/user");
const Store = require("../models/store");
const Rating = require("../models/rating");
const bcrypt = require("bcryptjs");

// =============================
// Get all users (Admin only)
// =============================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // hide password field
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =============================
// Get logged-in user profile
// =============================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =============================
// Update user profile or password
// =============================
exports.updateUser = async (req, res) => {
  try {
    const updates = { ...req.body };

    // If password is included, hash it
    if (updates.password) {
      if (
        updates.password.length < 8 ||
        updates.password.length > 16 ||
        !/[A-Z]/.test(updates.password) ||
        !/[!@#$%^&*]/.test(updates.password)
      ) {
        return res.status(400).json({
          message:
            "Password must be 8-16 characters, include 1 uppercase and 1 special character",
        });
      }
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    }).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User updated", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =============================
// Get all stores for a user (with ratings)
// =============================
exports.getStoresForUser = async (req, res) => {
  try {
    const { search } = req.query;
    const q = {};

    if (search) {
      q.$or = [
        { name: new RegExp(search, "i") },
        { address: new RegExp(search, "i") },
      ];
    }

    const stores = await Store.find(q).populate("owner", "name email");

    const result = [];
    for (const s of stores) {
      const ratings = await Rating.find({ store: s._id });
      const avg = ratings.length
        ? (
            ratings.reduce((a, b) => a + b.rating, 0) / ratings.length
          ).toFixed(2)
        : null;

      const userRatingDoc = await Rating.findOne({
        store: s._id,
        user: req.user.id,
      });
      const userRating = userRatingDoc ? userRatingDoc.rating : null;

      result.push({
        id: s._id,
        name: s.name,
        email: s.email,
        address: s.address,
        owner: s.owner,
        averageRating: avg,
        userRating,
      });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
