const express = require('express');
const Chat = require('../models/Chat');
const auth = require('../middleware/auth');

const router = express.Router();

// Get or create chat between two users
router.post('/start', auth, async (req, res) => {
  try {
    const { participantId } = req.body;
    const userId = req.user.userId;

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [userId, participantId] }
    }).populate('participants', 'name email role profile.profilePicture');

    if (!chat) {
      // Create new chat
      chat = new Chat({
        participants: [userId, participantId]
      });
      await chat.save();
      await chat.populate('participants', 'name email role profile.profilePicture');
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's chats
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const chats = await Chat.find({
      participants: userId
    })
    .populate('participants', 'name email role profile.profilePicture')
    .sort({ lastMessage: -1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Send message
router.post('/:chatId/message', auth, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is participant
    if (!chat.participants.includes(userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Add message
    chat.messages.push({
      sender: userId,
      content
    });
    chat.lastMessage = new Date();

    await chat.save();
    
    // Populate sender info for response
    await chat.populate('messages.sender', 'name email role profile.profilePicture');

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
