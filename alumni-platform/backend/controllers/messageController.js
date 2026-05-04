const Message = require("../models/Message");
const User = require("../models/User");
const MentorshipRequest = require("../models/MentorshipRequest");
const { sendToUser } = require("../ws/manager");

async function hasAcceptedMentorship(userAId, userBId) {
  const request = await MentorshipRequest.findOne({
    status: "accepted",
    $or: [
      { studentId: userAId, alumniId: userBId },
      { studentId: userBId, alumniId: userAId },
    ],
  });
  return !!request;
}

// ── Send a message ─────────────────────────────────────────────────────────
exports.send = async (req, res) => {
  try {
    const { receiver_id, content } = req.body;

    if (!receiver_id || !content?.trim())
      return res.status(400).json({ detail: "receiver_id and content are required" });

    if (receiver_id === req.user._id.toString())
      return res.status(400).json({ detail: "Cannot message yourself" });

    const receiver = await User.findById(receiver_id);
    if (!receiver) return res.status(404).json({ detail: "Receiver not found" });

    // Admins bypass the mentorship check
    if (req.user.role !== "admin" && receiver.role !== "admin") {
      const allowed = await hasAcceptedMentorship(
        req.user._id.toString(),
        receiver_id
      );
      if (!allowed)
        return res.status(403).json({
          detail: "You can only message someone after a mentorship request is accepted.",
        });
    }

    const m = await Message.create({
      senderId:     req.user._id,
      senderName:   req.user.name,
      receiverId:   receiver_id,
      receiverName: receiver.name,
      content:      content.trim(),
      read:         false,   // always unread until receiver opens the thread
    });

    // Push to both parties via WebSocket so UI updates instantly
    sendToUser(receiver_id,              { type: "message", data: m });
    sendToUser(req.user._id.toString(),  { type: "message", data: m });

    res.json(m);
  } catch (e) {
    console.error("send message error:", e);
    res.status(500).json({ detail: e.message });
  }
};

// ── Get full thread between current user and another user ──────────────────
exports.thread = async (req, res) => {
  try {
    const other = req.params.otherId;

    if (req.user.role !== "admin") {
      const allowed = await hasAcceptedMentorship(req.user._id.toString(), other);
      if (!allowed)
        return res.status(403).json({
          detail: "No accepted mentorship with this user.",
        });
    }

    const msgs = await Message.find({
      $or: [
        { senderId: req.user._id, receiverId: other },
        { senderId: other,        receiverId: req.user._id },
      ],
    }).sort("createdAt");

    res.json(msgs);
  } catch (e) {
    console.error("thread error:", e);
    res.status(500).json({ detail: e.message });
  }
};

// ── List conversations with unread_count ───────────────────────────────────
exports.conversations = async (req, res) => {
  try {
    const myId = req.user._id.toString();

    const msgs = await Message.find({
      $or: [{ senderId: req.user._id }, { receiverId: req.user._id }],
    }).sort("-createdAt");

    const seen = new Map();

    for (const m of msgs) {
      const isMine    = m.senderId.toString() === myId;
      const otherId   = isMine ? m.receiverId.toString() : m.senderId.toString();
      const otherName = isMine ? m.receiverName : m.senderName;

      if (!seen.has(otherId)) {
        // First (most recent) message for this conversation
        seen.set(otherId, {
          other_id:     otherId,
          other_name:   otherName,
          last_message: m.content,
          last_at:      m.createdAt,
          unread_count: 0,   // will tally below
        });
      }

      // Count messages sent TO me that are still unread
      if (!isMine && !m.read) {
        const conv = seen.get(otherId);
        conv.unread_count += 1;
      }
    }

    res.json([...seen.values()]);
  } catch (e) {
    console.error("conversations error:", e);
    res.status(500).json({ detail: e.message });
  }
};

// ── Mark all messages from a specific sender as read ──────────────────────
exports.markRead = async (req, res) => {
  try {
    const { otherId } = req.params;

    await Message.updateMany(
      {
        senderId:   otherId,
        receiverId: req.user._id,
        read:       false,
      },
      { $set: { read: true } }
    );

    res.json({ ok: true });
  } catch (e) {
    console.error("markRead error:", e);
    res.status(500).json({ detail: e.message });
  }
};