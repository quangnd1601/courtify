var express = require("express");
var router = express.Router();
var {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/ReviewController");

router.get("/", getAllReviews);
router.get("/:id", getReviewById);
router.post("/", createReview);
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);

module.exports = router;
