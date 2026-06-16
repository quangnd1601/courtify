const ReviewModel = require("../models/Review");
const SportsCenterModel = require("../models/SportsCenter");
const CourtModel = require("../models/Court");

// Recalculate ratings helper
const updateRatings = async (sport_center_id, court_id) => {
  if (sport_center_id) {
    const centerReviews = await ReviewModel.find({ sport_center_id });
    const review_count = centerReviews.length;
    const rating_avg =
      review_count > 0
        ? centerReviews.reduce((sum, r) => sum + r.rating, 0) / review_count
        : 0;
    await SportsCenterModel.findByIdAndUpdate(sport_center_id, {
      rating_avg,
      review_count,
    });
  }

  if (court_id) {
    const courtReviews = await ReviewModel.find({ court_id });
    const review_count = courtReviews.length;
    const rating_avg =
      review_count > 0
        ? courtReviews.reduce((sum, r) => sum + r.rating, 0) / review_count
        : 0;
    await CourtModel.findByIdAndUpdate(court_id, { rating_avg, review_count });
  }
};

let getAll = async () => {
  const reviews = await ReviewModel.find()
    .populate("user_id", "-password")
    .populate("booking_id")
    .populate("sport_center_id")
    .populate("court_id");
  return reviews;
};

let getOne = async (id) => {
  const review = await ReviewModel.findById(id)
    .populate("user_id", "-password")
    .populate("booking_id")
    .populate("sport_center_id")
    .populate("court_id");
  return review;
};

let create = async (data) => {
  const review = new ReviewModel(data);
  const savedReview = await review.save();
  await updateRatings(savedReview.sport_center_id, savedReview.court_id);
  return savedReview;
};

let update = async (id, data) => {
  const review = await ReviewModel.findByIdAndUpdate(id, data, { new: true });
  if (review) {
    await updateRatings(review.sport_center_id, review.court_id);
  }
  return review;
};

let remove = async (id) => {
  const review = await ReviewModel.findByIdAndDelete(id);
  if (review) {
    await updateRatings(review.sport_center_id, review.court_id);
  }
  return review;
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
};
