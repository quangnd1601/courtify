const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookingSchema = new Schema(
  {
    booking_code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sport_center_id: {
      type: Schema.Types.ObjectId,
      ref: "SportsCenter",
      required: true,
    },
    court_id: {
      type: Schema.Types.ObjectId,
      ref: "Court",
      required: true,
    },
    booking_date: {
      type: Date,
      required: true,
    },
    slots: [
      {
        start_time: { type: String, required: true },
        end_time: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    voucher_id: {
      type: Schema.Types.ObjectId,
      ref: "Voucher",
      default: null,
    },
    voucher_code: {
      type: String,
      default: null,
    },
    discount_amount: {
      type: Number,
      default: 0,
      min: 0,
    },
    total_price: {
      type: Number,
      required: true,
      min: 0,
    },
    payment_method: {
      type: String,
      enum: ["cash", "momo"],
      default: "cash",
    },
    payment_status: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
    booking_status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    note: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

// Chỉ mục này ngăn chặn việc đặt trùng sân, ngày và khung giờ, 
// bỏ qua (cho phép đặt lại) đối với các lịch đã hủy.
BookingSchema.index(
  { court_id: 1, booking_date: 1, "slots.start_time": 1 },
  {
    unique: true,
    partialFilterExpression: { booking_status: { $ne: "cancelled" } },
  }
);

module.exports = mongoose.model("Booking", BookingSchema);
