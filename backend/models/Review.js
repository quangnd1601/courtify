const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReviewSchema = new Schema(
  {
    booking_id: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
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
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

module.exports = mongoose.model("Review", ReviewSchema);
