const User = require('../models/user');
const Store = require('../models/store');
const Rating = require('../models/rating');

// Get dashboard data and support filters
exports.getDashboardData = async (req, res) => {
  try {
    const { search, role } = req.query;
    const userQuery = {};
    if (search) userQuery.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }, { address: new RegExp(search, 'i') }];
    if (role) userQuery.role = role;

    const users = await User.find(userQuery).select('-password');
    const stores = await Store.find().populate('owner', 'name email');
    const totalUsers = await User.countDocuments();
    const totalStores = await Store.countDocuments();
    const totalRatings = await Rating.countDocuments();

    res.status(200).json({ users, stores, totalUsers, totalStores, totalRatings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
