const express = require('express');
const router = express.Router();
const Chat = require('../models/chat');
const Message = require('../models/message');

// Middleware to check if user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

// Find or create chat between current user and other user, then redirect
router.get('/chatWith/:otherUserId', isLoggedIn, async (req, res, next) => {
  try {
    const currentUserId = req.user._id.toString();
    const otherUserId = req.params.otherUserId;

    if (currentUserId === otherUserId) {
      // Optionally redirect somewhere else or show error
      return res.redirect('/chats');
    }

    let chat = await Chat.findOne({
      participants: { $all: [currentUserId, otherUserId] }
    });

    if (!chat) {
      chat = await Chat.create({ participants: [currentUserId, otherUserId] });
    }

    res.redirect(`/chats/${chat._id}`);
  } catch (err) {
    next(err);
  }
});

// Get all chats for logged-in user
router.get('/chats', isLoggedIn, async (req, res, next) => {
  try {
    const chats = await Chat.find({ participants: req.user._id }).populate('participants', 'username');
    res.render('chats/chatIndex', { chats, currentUser: req.user });
  } catch (err) {
    next(err);
  }
});

// Get messages for a specific chat room
router.get('/chats/:chatId', isLoggedIn, async (req, res, next) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId).populate('participants', 'username');
    if (!chat || !chat.participants.some(p => p._id.equals(req.user._id))) {
      return res.status(403).send("You don't have access to this chat");
    }

    // ✅ Derive consistent roomId based on sender and recipient
    const participantIds = chat.participants.map(p => p._id.toString()).sort();
    const roomId = participantIds.join('_');

    const messages = await Message.find({ roomId })
      .populate('sender', 'username')
      .sort({ createdAt: 1 });

    res.render('chats/chat', { chat, messages, currentUser: req.user });

  } catch (err) {
    next(err);
  }
});


module.exports = router;
