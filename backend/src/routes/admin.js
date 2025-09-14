const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getDashboardData } = require('../controllers/adminController');

router.get('/dashboard', auth(['admin']), getDashboardData);

module.exports = router;
