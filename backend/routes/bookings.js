var express = require("express");
var router = express.Router();
var {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
} = require("../controllers/BookingController");

router.get("/", getAllBookings);
router.get("/:id", getBookingById);
router.post("/", createBooking);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);

module.exports = router;
