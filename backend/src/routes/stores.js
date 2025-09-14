const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  createStore,
  getAllStores,
  getStoreById,
  updateStore,
  deleteStore
} = require('../controllers/storeController');

// Public route
router.get('/', getAllStores);
router.get('/:id', getStoreById);

// Owner routes
router.post('/', auth(['owner']), createStore);
router.put('/:id', auth(['owner']), updateStore);
router.delete('/:id', auth(['owner']), deleteStore);

module.exports = router;
