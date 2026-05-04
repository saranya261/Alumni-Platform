const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { createAccessToken, createRefreshToken, setAuthCookies } = require("../utils/tokens");

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

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, industry, graduation_year } = req.body;
    if (!name || !email || !password || !role)
      return res.status(400).json({ detail: "Missing required fields" });
    if (!["student", "alumni"].includes(role))
      return res.status(400).json({ detail: "Invalid role" });

    const normalized = email.toLowerCase();
    if (await User.findOne({ email: normalized }))
      return res.status(400).json({ detail: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: normalized,
      password: hashed,
      role,
      industry: industry || "",
      graduation_year: graduation_year || null,
    });
    const access = createAccessToken(user);
    const refresh = createRefreshToken(user);
    setAuthCookies(res, access, refresh);
    res.json({ user: publicUser(user), access_token: access });
  } catch (e) {
    res.status(500).json({ detail: e.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ detail: "Invalid email or password" });
    const access = createAccessToken(user);
    const refresh = createRefreshToken(user);
    setAuthCookies(res, access, refresh);
    res.json({ user: publicUser(user), access_token: access });
  } catch (e) {
    res.status(500).json({ detail: e.message });
  }
};

exports.logout = (_, res) => {
  res.clearCookie("access_token", { path: "/" });
  res.clearCookie("refresh_token", { path: "/" });
  res.json({ ok: true });
};

exports.me = (req, res) => res.json(publicUser(req.user));

exports.wsToken = (req, res) => res.json({ token: createAccessToken(req.user) });

exports.refresh = async (req, res) => {
  try {
    const rt = req.cookies?.refresh_token;
    if (!rt) return res.status(401).json({ detail: "No refresh token" });
    const payload = jwt.verify(rt, process.env.JWT_SECRET);
    if (payload.type !== "refresh") return res.status(401).json({ detail: "Invalid token" });
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ detail: "User not found" });
    const access = createAccessToken(user);
    const secure = process.env.NODE_ENV === "production";
    res.cookie("access_token", access, {
      httpOnly: true,
      secure,
      sameSite: secure ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });
    res.json({ ok: true });
  } catch {
    res.status(401).json({ detail: "Invalid refresh token" });
  }
};
