const router = require("express").Router();
const c = require("../controllers/authController");
const { authRequired } = require("../middleware/auth");

router.post("/register", c.register);
router.post("/login", c.login);
router.post("/logout", c.logout);
router.get("/me", authRequired, c.me);
router.post("/ws-token", authRequired, c.wsToken);
router.post("/refresh", c.refresh);

module.exports = router;
