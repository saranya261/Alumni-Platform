const jwt = require("jsonwebtoken");

const ACCESS_MIN = 60 * 24; // 24h
const REFRESH_DAYS = 7;

function createAccessToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), email: user.email, role: user.role, type: "access" },
    process.env.JWT_SECRET,
    { expiresIn: `${ACCESS_MIN}m` }
  );
}
function createRefreshToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), type: "refresh" },
    process.env.JWT_SECRET,
    { expiresIn: `${REFRESH_DAYS}d` }
  );
}
function setAuthCookies(res, access, refresh) {
  const secure = process.env.NODE_ENV === "production";
  res.cookie("access_token", access, {
    httpOnly: true,
    secure,
    sameSite: secure ? "none" : "lax",
    maxAge: ACCESS_MIN * 60 * 1000,
    path: "/",
  });
  res.cookie("refresh_token", refresh, {
    httpOnly: true,
    secure,
    sameSite: secure ? "none" : "lax",
    maxAge: REFRESH_DAYS * 86400 * 1000,
    path: "/",
  });
}
module.exports = { createAccessToken, createRefreshToken, setAuthCookies };
