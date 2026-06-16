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
      return res.status(400).json({
        message:
          "Vui lòng nhập đầy đủ các thông tin bắt buộc (user_id, sport_center_id, court_id, booking_date, slots, subtotal, total_price)",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(user_id) ||
      !mongoose.Types.ObjectId.isValid(sport_center_id) ||
      !mongoose.Types.ObjectId.isValid(court_id)
    ) {
      return res.status(400).json({ message: "ID liên kết không hợp lệ" });
    }

    // Check trùg
    const startTimes = slots.map((s) => s.start_time);
    const hasConflict = await BookingService.checkConflict(
      court_id,
      booking_date,
      startTimes,
    );
    if (hasConflict) {
      return res.status(400).json({
        message:
          "Khung giờ này vừa mới được người khác đặt, vui lòng chọn khung giờ khác",
      });
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
    //  double booking
    if (error.code === 11000) {
      return res.status(400).json({
        message:
          "Khung giờ này vừa mới được người khác đặt, vui lòng chọn khung giờ khác",
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
        message:
          "Khung giờ này đã được người khác đặt, vui lòng chọn khung giờ khác",
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

/**
 * Tách 1 pricing entry (có thể là dải nhiều tiếng) thành từng slot 1 giờ.
 * Ví dụ: { start_time: "05:00", end_time: "17:00", price: 100000 }
 *   → [{ start_time: "05:00", end_time: "06:00", price: 100000 },
 *      { start_time: "06:00", end_time: "07:00", price: 100000 }, ...]
 */
const expandPricingToHourlySlots = (pricing) => {
  const hourlySlots = [];

  for (const entry of pricing) {
    const [startH, startM] = entry.start_time.split(":").map(Number);
    const [endH, endM] = entry.end_time.split(":").map(Number);

    // Tổng phút từ 00:00
    let currentMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    while (currentMinutes + 60 <= endMinutes) {
      const slotStartH = String(Math.floor(currentMinutes / 60)).padStart(
        2,
        "0",
      );
      const slotStartM = String(currentMinutes % 60).padStart(2, "0");
      const slotEndH = String(Math.floor((currentMinutes + 60) / 60)).padStart(
        2,
        "0",
      );
      const slotEndM = String((currentMinutes + 60) % 60).padStart(2, "0");

      hourlySlots.push({
        start_time: `${slotStartH}:${slotStartM}`,
        end_time: `${slotEndH}:${slotEndM}`,
        price: entry.price,
      });

      currentMinutes += 60;
    }
  }

  return hourlySlots;
};

const getAvailableSlots = async (req, res, next) => {
  try {
    const { court_id, date } = req.query;

    if (!court_id || !date) {
      return res.status(400).json({ message: "Cần truyền court_id và date" });
    }
    if (!mongoose.Types.ObjectId.isValid(court_id)) {
      return res.status(400).json({ message: "court_id không hợp lệ" });
    }

    // Lấy thông tin sân → lấy sport_center_id
    const CourtModel = require("../models/Court");
    const court = await CourtModel.findById(court_id);
    if (!court) {
      return res.status(404).json({ message: "Không tìm thấy sân" });
    }

    // Lấy bảng giá từ SportsCenter cha
    const SportsCenterModel = require("../models/SportsCenter");
    const center = await SportsCenterModel.findById(court.sport_center_id);
    if (!center || !center.pricing || center.pricing.length === 0) {
      return res.status(200).json({ slots: [] });
    }

    // Expand tất cả thành từng slot 1 giờ
    const allHourlySlots = expandPricingToHourlySlots(center.pricing);

    // Lấy tất cả booking đã đặt cho sân này vào ngày này (không bị huỷ)
    const BookingModel = require("../models/Booking");
    const bookings = await BookingModel.find({
      court_id: court_id,
      booking_date: new Date(date),
      booking_status: { $ne: "cancelled" },
    });

    // Tập hợp start_time đã bị đặt
    const bookedStartTimes = new Set();
    bookings.forEach((b) => {
      b.slots.forEach((s) => bookedStartTimes.add(s.start_time));
    });

    // Xác định trạng thái của từng slot (đã bị đặt hay chưa)
    const slotsWithStatus = allHourlySlots.map((slot) => ({
      ...slot,
      isBooked: bookedStartTimes.has(slot.start_time),
    }));

    res.status(200).json({ slots: slotsWithStatus });
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
  getAvailableSlots,
};
