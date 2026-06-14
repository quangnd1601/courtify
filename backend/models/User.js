const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    avatar: String,
    role: { type: String, enum: ["admin", "owner", "user"], default: "user" },
    status: { type: String, enum: ["active", "blocked"], default: "active" },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

module.exports = mongoose.model("User", UserSchema);
