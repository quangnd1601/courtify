const ReviewService = require("../services/ReviewServices");
const mongoose = require("mongoose");

const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await ReviewService.getAll();
    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const getReviewById = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    const review = await ReviewService.getOne(id);
    if (!review) {
      return res.status(404).json({ message: "Không tìm thấy đánh giá" });
    }
    res.status(200).json({ review });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const createReview = async (req, res, next) => {
  try {
    const { booking_id, user_id, sport_center_id, court_id, rating, comment } = req.body;
    if (!booking_id || !user_id || !sport_center_id || !court_id || rating === undefined) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ các thông tin bắt buộc (booking_id, user_id, sport_center_id, court_id, rating)",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(booking_id) ||
      !mongoose.Types.ObjectId.isValid(user_id) ||
      !mongoose.Types.ObjectId.isValid(sport_center_id) ||
      !mongoose.Types.ObjectId.isValid(court_id)
    ) {
      return res.status(400).json({ message: "ID liên kết không hợp lệ" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Đánh giá sao phải từ 1 đến 5" });
    }

    const newReview = await ReviewService.create({
      booking_id,
      user_id,
      sport_center_id,
      court_id,
      rating,
      comment,
    });
    res.status(201).json({ review: newReview });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const updateReview = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    if (req.body.rating !== undefined && (req.body.rating < 1 || req.body.rating > 5)) {
      return res.status(400).json({ message: "Đánh giá sao phải từ 1 đến 5" });
    }
    const review = await ReviewService.update(id, req.body);
    if (!review) {
      return res.status(404).json({ message: "Không tìm thấy đánh giá" });
    }
    res.status(200).json({ review });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    const review = await ReviewService.remove(id);
    if (!review) {
      return res.status(404).json({ message: "Không tìm thấy đánh giá" });
    }
    res.status(200).json({ message: "Xóa đánh giá thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
};
