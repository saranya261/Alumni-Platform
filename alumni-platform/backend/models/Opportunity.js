const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, default: "" },
    job_type: { type: String, default: "Full-time" },
    link: { type: String, default: "" },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    postedByName: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Opportunity", schema);
