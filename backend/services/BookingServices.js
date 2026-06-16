const BookingModel = require("../models/Booking");

let getAll = async () => {
  const bookings = await BookingModel.find()
    .populate("user_id", "-password")
    .populate("sport_center_id")
    .populate("court_id")
    .populate("voucher_id");
  return bookings;
};

let getOne = async (id) => {
  const booking = await BookingModel.findById(id)
    .populate("user_id", "-password")
    .populate("sport_center_id")
    .populate("court_id")
    .populate("voucher_id");
  return booking;
};

let create = async (data) => {
  if (!data.booking_code) {
    data.booking_code = "BK" + Date.now() + Math.floor(Math.random() * 1000);
  }
  const booking = new BookingModel(data);
  const savedBooking = await booking.save();

  // Tăng booking_count nếu đơn đặt không ở trạng thái huỷ ngay từ đầu
  if (savedBooking && savedBooking.booking_status !== "cancelled") {
    const SportsCenterModel = require("../models/SportsCenter");
    const CourtModel = require("../models/Court");
    await SportsCenterModel.findByIdAndUpdate(savedBooking.sport_center_id, {
      $inc: { booking_count: 1 },
    });
    await CourtModel.findByIdAndUpdate(savedBooking.court_id, {
      $inc: { booking_count: 1 },
    });
  }

  return savedBooking;
};

let update = async (id, data) => {
  const oldBooking = await BookingModel.findById(id);
  if (!oldBooking) return null;

  const booking = await BookingModel.findByIdAndUpdate(id, data, { new: true })
    .populate("user_id", "-password")
    .populate("sport_center_id")
    .populate("court_id")
    .populate("voucher_id");

  if (booking) {
    const SportsCenterModel = require("../models/SportsCenter");
    const CourtModel = require("../models/Court");

    // Nếu chuyển từ KHÁC cancelled sang cancelled -> Giảm count
    if (
      oldBooking.booking_status !== "cancelled" &&
      data.booking_status === "cancelled"
    ) {
      await SportsCenterModel.findByIdAndUpdate(booking.sport_center_id, {
        $inc: { booking_count: -1 },
      });
      await CourtModel.findByIdAndUpdate(booking.court_id, {
        $inc: { booking_count: -1 },
      });
    }
    // Nếu chuyển từ cancelled sang trạng thái bình thường -> Tăng count
    else if (
      oldBooking.booking_status === "cancelled" &&
      data.booking_status &&
      data.booking_status !== "cancelled"
    ) {
      await SportsCenterModel.findByIdAndUpdate(booking.sport_center_id, {
        $inc: { booking_count: 1 },
      });
      await CourtModel.findByIdAndUpdate(booking.court_id, {
        $inc: { booking_count: 1 },
      });
    }
  }

  return booking;
};

let remove = async (id) => {
  const booking = await BookingModel.findByIdAndDelete(id);
  if (booking && booking.booking_status !== "cancelled") {
    const SportsCenterModel = require("../models/SportsCenter");
    const CourtModel = require("../models/Court");
    await SportsCenterModel.findByIdAndUpdate(booking.sport_center_id, {
      $inc: { booking_count: -1 },
    });
    await CourtModel.findByIdAndUpdate(booking.court_id, {
      $inc: { booking_count: -1 },
    });
  }
  return booking;
};

let checkConflict = async (courtId, bookingDate, startTimes) => {
  const conflict = await BookingModel.findOne({
    court_id: courtId,
    booking_date: new Date(bookingDate),
    booking_status: { $ne: "cancelled" },
    slots: {
      $elemMatch: {
        start_time: { $in: startTimes },
      },
    },
  });
  return conflict;
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
  checkConflict,
};
