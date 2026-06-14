const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VoucherSchema = new Schema(
  {
    owner_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sport_center_id: {
      type: Schema.Types.ObjectId,
      ref: "SportsCenter",
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: String,
    discount_percent: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    max_discount: {
      type: Number,
      required: true,
      min: 0,
    },
    min_order: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    usage_limit: {
      type: Number,
      required: true,
      min: 1,
    },
    used_count: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "expired"],
      default: "active",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

module.exports = mongoose.model("Voucher", VoucherSchema);
