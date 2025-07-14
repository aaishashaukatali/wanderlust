const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, validateReview, isOwner } = require("../middleware");
const reviewController = require("../controllers/reviews");

router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.postReview)
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isOwner,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
