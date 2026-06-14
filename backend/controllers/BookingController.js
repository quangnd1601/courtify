const BookingService = require("../services/BookingServices");
const mongoose = require("mongoose");

const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await BookingService.getAll();
    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const getBookingById = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    const booking = await BookingService.getOne(id);
    if (!booking) {
      return res.status(404).json({ message: "Không tìm thấy booking" });
    }
    res.status(200).json({ booking });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const createBooking = async (req, res, next) => {
  try {
    const {
      booking_code,
      user_id,
      sport_center_id,
      court_id,
      booking_date,
      slots,
      subtotal,
      voucher_id,
      voucher_code,
      discount_amount,
      total_price,
      payment_method,
      payment_status,
      booking_status,
      note,
    } = req.body;

    if (
      !user_id ||
      !sport_center_id ||
      !court_id ||
      !booking_date ||
      !slots ||
      slots.length === 0 ||
      subtotal === undefined ||
      total_price === undefined
    ) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ các thông tin bắt buộc (user_id, sport_center_id, court_id, booking_date, slots, subtotal, total_price)" });
    }

    if (
      !mongoose.Types.ObjectId.isValid(user_id) ||
      !mongoose.Types.ObjectId.isValid(sport_center_id) ||
      !mongoose.Types.ObjectId.isValid(court_id)
    ) {
      return res.status(400).json({ message: "ID liên kết không hợp lệ" });
    }

    const newBooking = await BookingService.create({
      booking_code,
      user_id,
      sport_center_id,
      court_id,
      booking_date,
      slots,
      subtotal,
      voucher_id,
      voucher_code,
      discount_amount,
      total_price,
      payment_method,
      payment_status,
      booking_status,
      note,
    });
    res.status(201).json({ booking: newBooking });
  } catch (error) {
    // Handle double booking unique compound index violation
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Khung giờ này vừa mới được người khác đặt, vui lòng chọn khung giờ khác",
        error: error.message,
      });
    }
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const updateBooking = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    const booking = await BookingService.update(id, req.body);
    if (!booking) {
      return res.status(404).json({ message: "Không tìm thấy booking" });
    }
    res.status(200).json({ booking });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Khung giờ này vừa mới được người khác đặt, vui lòng chọn khung giờ khác",
        error: error.message,
      });
    }
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const deleteBooking = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    const booking = await BookingService.remove(id);
    if (!booking) {
      return res.status(404).json({ message: "Không tìm thấy booking" });
    }
    res.status(200).json({ message: "Xóa booking thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
};
