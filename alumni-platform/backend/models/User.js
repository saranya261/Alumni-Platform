const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "alumni", "admin"], default: "student" },
    bio: { type: String, default: "" },
    skills: { type: [String], default: [] },
    industry: { type: String, default: "" },
    experience: { type: String, default: "" },
    graduation_year: { type: Number, default: null },
    avatar: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
