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
  // Tạo mã booking
  if (!data.booking_code) {
    data.booking_code = "BK" + Date.now() + Math.floor(Math.random() * 1000);
  }
  const booking = new BookingModel(data);
  const savedBooking = await booking.save();
  return savedBooking;
};

let update = async (id, data) => {
  const booking = await BookingModel.findByIdAndUpdate(id, data, { new: true })
    .populate("user_id", "-password")
    .populate("sport_center_id")
    .populate("court_id")
    .populate("voucher_id");
  return booking;
};
let remove = async (id) => {
  const booking = await BookingModel.findByIdAndDelete(id);
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
