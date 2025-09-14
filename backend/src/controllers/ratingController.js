const Rating = require("../models/Rating");
const Store = require("../models/Store");

// Add or update a rating
const addOrUpdateRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    let existing = await Rating.findOne({ user: userId, store: storeId });

    if (existing) {
      existing.rating = rating;
      await existing.save();
      return res.json({ message: "Rating updated", rating: existing });
    }

    const newRating = await Rating.create({ rating, user: userId, store: storeId });
    res.status(201).json({ message: "Rating added", rating: newRating });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all ratings for a store
const getRatingsByStore = async (req, res) => {
  try {
    const ratings = await Rating.find({ store: req.params.storeId }).populate("user", "name email");
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get ratings submitted by a user
const getUserRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ user: req.user.id }).populate("store", "name address");
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addOrUpdateRating,
  getRatingsByStore,
  getUserRatings,
};
