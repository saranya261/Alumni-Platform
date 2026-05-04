const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    senderId:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    senderName:   String,
    receiverId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverName: String,
    content:      { type: String, required: true },
    // ── NEW: false until the receiver opens the conversation ──
    read:         { type: Boolean, default: false },
  },
  { timestamps: true }
);

schema.index({ senderId: 1, receiverId: 1, createdAt: 1 });

module.exports = mongoose.model("Message", schema);