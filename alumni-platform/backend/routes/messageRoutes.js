const router = require("express").Router();
const c = require("../controllers/messageController");
const { authRequired } = require("../middleware/auth");

router.post("/",                  authRequired, c.send);
router.get("/conversations",      authRequired, c.conversations);
router.get("/thread/:otherId",    authRequired, c.thread);
router.post("/read/:otherId",     authRequired, c.markRead);   // ← NEW

module.exports = router;