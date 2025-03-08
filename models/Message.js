const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    author: { type: String, default: "Anonymous" },
    type: { type: String, enum: ["public", "private"], required: true },
    expiresAt: { type: Date, default: null },
    likes: { type: Number, default: 0 }, // New field for likes
    viewed: { type: Boolean, default: false },
  },
  { timestamps: true } // ✅ This adds createdAt and updatedAt automatically
);

module.exports = mongoose.model("Message", messageSchema);
