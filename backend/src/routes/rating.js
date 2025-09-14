const express = require("express");
const router = express.Router();
const { addOrUpdateRating, getUserRatings, getRatingsByStore } = require("../controllers/ratingController");
const auth = require("../middlewares/auth");


router.post("/", auth(["user"]), addOrUpdateRating);


router.get("/user", auth(["user"]), getUserRatings);


router.get("/store/:storeId", auth(["owner", "admin"]), getRatingsByStore);

module.exports = router;
