const router = require("express").Router();
const c = require("../controllers/opportunityController");
const { authRequired } = require("../middleware/auth");

router.post("/", authRequired, c.create);
router.get("/", authRequired, c.list);
router.delete("/:id", authRequired, c.remove);

module.exports = router;
