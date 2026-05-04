const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    studentName: String,
    alumniId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    alumniName: String,
    message: { type: String, required: true },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MentorshipRequest", schema);
