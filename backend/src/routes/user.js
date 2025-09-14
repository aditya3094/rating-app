const express = require("express");
const router = express.Router();
const { getAllUsers, getProfile, updateUser, getStoresForUser } = require("../controllers/userController");
const auth = require("../middlewares/auth");

//  Admin only: get all users
router.get("/", auth(["admin"]), getAllUsers);

// ✅ Logged-in user: profile
router.get("/profile", auth(["user", "owner", "admin"]), getProfile);

//  Logged-in user: update profile or password
router.put("/update", auth(["user", "owner", "admin"]), updateUser);

//  Normal user: list stores with average & user’s rating
router.get("/stores", auth(["user"]), getStoresForUser);

module.exports = router;
