const express = require("express"); // Import express
const router = express.Router(); // Initialize router
const {
  postPublicMessage,
  postPrivateMessage,
  getPrivateMessage,
  getAllPublicMessages,
  likeMessage, // ✅ Correct function name
} = require("../controllers/messageController");

router.post("/public", postPublicMessage);
router.post("/private", postPrivateMessage);
router.get("/private/:id", getPrivateMessage);
router.get("/public", getAllPublicMessages);
router.post("/:id/like", likeMessage); // ✅ Use the correct function

module.exports = router; // Export router
