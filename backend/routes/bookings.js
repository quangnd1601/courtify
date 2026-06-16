var express = require("express");
var router = express.Router();
var {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  getAvailableSlots,
} = require("../controllers/BookingController");

var authen = require("../middleware/authen");
router.get("/", getAllBookings);
router.get("/available-slots", getAvailableSlots); // ?court_id=...&date=YYYY-MM-DD
router.get("/:id", getBookingById);
router.post("/", createBooking);
router.put("/:id", updateBooking); // authen
router.delete("/:id", deleteBooking);

module.exports = router;
