const router = require("express").Router();
const c = require("../controllers/userController");
const { authRequired } = require("../middleware/auth");

router.get("/", authRequired, c.list);
router.put("/me", authRequired, c.updateMe);
router.get("/:id", authRequired, c.getOne);

module.exports = router;
