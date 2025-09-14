const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getMyStores } = require('../controllers/ownerController');

router.get('/dashboard', auth(['owner']), getMyStores);

module.exports = router;
