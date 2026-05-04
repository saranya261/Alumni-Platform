const User = require("../models/User");

const publicUser = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  role: u.role,
  bio: u.bio,
  skills: u.skills,
  industry: u.industry,
  experience: u.experience,
  graduation_year: u.graduation_year,
  avatar: u.avatar,
  created_at: u.createdAt,
});

exports.list = async (req, res) => {
  const { role, industry, search } = req.query;
  const q = {};
  if (role) q.role = role;
  if (industry) q.industry = { $regex: industry, $options: "i" };
  if (search) {
    q.$or = [
      { name: { $regex: search, $options: "i" } },
      { skills: { $regex: search, $options: "i" } },
      { bio: { $regex: search, $options: "i" } },
    ];
  }
  const users = await User.find(q).select("-password").limit(500);
  res.json(users.map(publicUser));
};

exports.getOne = async (req, res) => {
  const u = await User.findById(req.params.id).select("-password");
  if (!u) return res.status(404).json({ detail: "User not found" });
  res.json(publicUser(u));
};

exports.updateMe = async (req, res) => {
  const allowed = ["name", "bio", "skills", "industry", "experience", "graduation_year", "avatar"];
  const updates = {};
  for (const k of allowed) if (req.body[k] !== undefined) updates[k] = req.body[k];
  const u = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select("-password");
  res.json(publicUser(u));
};
