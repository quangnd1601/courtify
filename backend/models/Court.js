const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourtSchema = new Schema(
  {
    sport_center_id: {
      type: Schema.Types.ObjectId,
      ref: "SportsCenter",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    thumbnail: String,
    gallery: [String],
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
      enum: ["active", "maintenance", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

module.exports = mongoose.model("Court", CourtSchema);
