const Message = require("../models/Message");

// Post a Public Message
exports.postPublicMessage = async (req, res) => {
  try {
    const { content, author } = req.body;
    const newMessage = new Message({
      content,
      type: "public",
      author: author || "Anonymous",
    });
    await newMessage.save();
    res.status(201).json({ success: true, message: "Public message posted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Post a Private Message
exports.postPrivateMessage = async (req, res) => {
  try {
    console.log("📩 Private Message Request Received:", req.body); // 🛠️ Debugging Log

    const { content, expiryHours } = req.body;

    // ✅ Validate Input
    if (!content || !expiryHours) {
      return res.status(400).json({
        success: false,
        message: "Content and expiryHours are required",
      });
    }

    // ✅ Creating Expiry Date
    const expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000);

    // ✅ Create New Message
    const newMessage = new Message({ content, type: "private", expiresAt });
    await newMessage.save();

    console.log("✅ Private Message Created:", newMessage._id); // Debugging log

    // ✅ Send Response
    res.status(201).json({
      success: true,
      messageId: newMessage._id, // Corrected key
      link: `${req.protocol}://${req.get("host")}/message/${newMessage._id}`,
    });
  } catch (error) {
    console.error("❌ Error posting private message:", error); // Debugging log
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get Private Message (Once)
exports.getPrivateMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message || message.type !== "private") {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }
    if (message.viewed || new Date() > new Date(message.expiresAt)) {
      await Message.findByIdAndDelete(req.params.id);
      return res
        .status(410)
        .json({ success: false, message: "Message expired or already viewed" });
    }
    message.viewed = true;
    await message.save();
    res.json({ success: true, message: message.content });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get All Public Messages with Likes & Timestamp
exports.getAllPublicMessages = async (req, res) => {
  try {
    const messages = await Message.find({ type: "public" })
      .sort({ createdAt: -1 }) // Latest messages first
      .select("content author likes createdAt"); // Select required fields

    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("❌ Error fetching public messages:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Like a Message (Public Confession)
exports.likeMessage = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🛠️ Liking message ID:", id); // Debugging log

    // Find the message by ID
    const message = await Message.findById(id);
    if (!message) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }

    // Increment likes
    message.likes = (message.likes || 0) + 1;
    await message.save();

    console.log("✅ Message liked successfully:", message._id); // Debugging log

    res.json({ success: true, likes: message.likes });
  } catch (error) {
    console.error("❌ Error liking message:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
