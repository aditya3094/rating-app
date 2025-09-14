const Store = require('../models/store');
const Rating = require('../models/rating');

// Get all stores of logged-in owner with ratings
exports.getMyStores = async (req, res) => {
  try {
    const stores = await Store.find({ owner: req.user.id });
    const result = [];
    for (const s of stores) {
      const ratings = await Rating.find({ store: s._id }).populate('user', 'name email');
      const avg = ratings.length ? (ratings.reduce((a,b)=>a+b.rating,0)/ratings.length).toFixed(2) : null;
      result.push({ store: s, averageRating: avg, ratings });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
