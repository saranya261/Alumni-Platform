const MentorshipRequest = require("../models/MentorshipRequest");
const User = require("../models/User");
const { sendToUser } = require("../ws/manager");

exports.create = async (req, res) => {
  if (req.user.role !== "student")
    return res.status(403).json({ detail: "Only students can request mentorship" });

  const { alumni_id, message } = req.body;
  const alum = await User.findById(alumni_id);
  if (!alum || alum.role !== "alumni")
    return res.status(404).json({ detail: "Alumni not found" });

  const dup = await MentorshipRequest.findOne({
    studentId: req.user._id,
    alumniId: alumni_id,
    status: "pending",
  });
  if (dup) return res.status(400).json({ detail: "You already have a pending request" });

  const r = await MentorshipRequest.create({
    studentId: req.user._id,
    studentName: req.user.name,
    alumniId: alumni_id,
    alumniName: alum.name,
    message,
  });

  // 🔔 Notify the alumni in real time
  sendToUser(alumni_id.toString(), {
    type: "mentorship_request",
    data: {
      _id: r._id,
      studentName: req.user.name,
      message,
      status: "pending",
    },
  });

  res.json(r);
};

exports.mine = async (req, res) => {
  const list = await MentorshipRequest.find({
    $or: [{ studentId: req.user._id }, { alumniId: req.user._id }],
  }).sort("-createdAt");
  res.json(list);
};

exports.update = async (req, res) => {
  const { status } = req.body;
  if (!["accepted", "rejected"].includes(status))
    return res.status(400).json({ detail: "Invalid status" });

  const r = await MentorshipRequest.findById(req.params.id);
  if (!r) return res.status(404).json({ detail: "Not found" });
  if (r.alumniId.toString() !== req.user._id.toString())
    return res.status(403).json({ detail: "Only the recipient alumni can respond" });

  r.status = status;
  await r.save();

  // 🔔 Notify the student that their request was accepted/rejected
  sendToUser(r.studentId.toString(), {
    type: "mentorship_update",
    data: {
      _id: r._id,
      alumniName: req.user.name,
      status,
    },
  });

  res.json(r);
};