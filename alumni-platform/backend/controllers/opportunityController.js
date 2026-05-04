const Opportunity = require("../models/Opportunity");

exports.create = async (req, res) => {
  if (!["alumni", "admin"].includes(req.user.role))
    return res.status(403).json({ detail: "Only alumni can post opportunities" });
  const o = await Opportunity.create({
    ...req.body,
    postedBy: req.user._id,
    postedByName: req.user.name,
  });
  res.json(o);
};

exports.list = async (_, res) => {
  const list = await Opportunity.find({}).sort("-createdAt").limit(500);
  res.json(list);
};

exports.remove = async (req, res) => {
  const o = await Opportunity.findById(req.params.id);
  if (!o) return res.status(404).json({ detail: "Not found" });
  if (o.postedBy.toString() !== req.user._id.toString() && req.user.role !== "admin")
    return res.status(403).json({ detail: "Not allowed" });
  await o.deleteOne();
  res.json({ ok: true });
};
