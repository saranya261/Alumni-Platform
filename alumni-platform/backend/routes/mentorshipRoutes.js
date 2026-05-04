const router = require("express").Router();
const c = require("../controllers/mentorshipController");
const { authRequired } = require("../middleware/auth");

router.post("/", authRequired, c.create);
router.get("/my", authRequired, c.mine);
router.patch("/:id", authRequired, c.update);

module.exports = router;
