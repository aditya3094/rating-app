const Store = require('../models/store');
const Rating = require('../models/rating');

// Create a store (Owner only)
exports.createStore = async (req, res) => {
  try {
    const store = await Store.create({ ...req.body, owner: req.user.id });
    res.status(201).json(store);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all stores with average rating
exports.getAllStores = async (req, res) => {
  try {
    const { search } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { address: new RegExp(search, 'i') }
      ];
    }
    const stores = await Store.find(query).populate('owner', 'name email');
    // compute avg rating for each
    const results = [];
    for (const s of stores) {
      const ratings = await Rating.find({ store: s._id });
      const avg = ratings.length ? (ratings.reduce((a,b)=>a+b.rating,0)/ratings.length).toFixed(2) : null;
      results.push({ id: s._id, name: s.name, email: s.email, address: s.address, owner: s.owner, averageRating: avg });
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single store by id with ratings
exports.getStoreById = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id).populate('owner', 'name email');
    if (!store) return res.status(404).json({ message: 'Store not found' });
    const ratings = await Rating.find({ store: store._id }).populate('user', 'name email');
    const avg = ratings.length ? (ratings.reduce((a,b)=>a+b.rating,0)/ratings.length).toFixed(2) : null;
    res.status(200).json({ store, ratings, averageRating: avg });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update store (Owner only)
exports.updateStore = async (req, res) => {
  try {
    const store = await Store.findOneAndUpdate({ _id: req.params.id, owner: req.user.id }, req.body, { new: true });
    if (!store) return res.status(404).json({ message: 'Store not found or not owned by you' });
    res.status(200).json(store);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete store (Owner only)
exports.deleteStore = async (req, res) => {
  try {
    const store = await Store.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!store) return res.status(404).json({ message: 'Store not found or not owned by you' });
    res.status(200).json({ message: 'Store deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
