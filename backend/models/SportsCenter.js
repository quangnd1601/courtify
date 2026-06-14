const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SportsCenterSchema = new Schema(
  {
    owner_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sport_id: {
      type: Schema.Types.ObjectId,
      ref: "Sport",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    location: String,
    description: String,
    thumbnail: String,
    gallery: [String],
    pricing: [
      {
        start_time: { type: String, required: true },
        end_time: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    rating_avg: {
      type: Number,
      default: 0,
    },
    review_count: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    booking_count: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

module.exports = mongoose.model("SportsCenter", SportsCenterSchema);
