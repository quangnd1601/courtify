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
  // Auto-generate booking code if not provided
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

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
};
