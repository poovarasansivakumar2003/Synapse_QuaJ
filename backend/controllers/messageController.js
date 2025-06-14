const Message = require('../models/Message.model')
const Conversation = require('../models/Conversation.model') // New model

module.exports = {
  createConversation: async (req, res) => {
    const conversation = await Conversation.create({
      participants: [req.user.id, req.body.recipientId],
      lastMessage: req.body.content,
    })
    res.status(201).json(conversation)
  },

  sendMessage: async (req, res) => {
    const message = await Message.create({
      ...req.body,
      sender: req.user.id,
      conversationId: req.params.conversationId,
    })

    await Conversation.findByIdAndUpdate(req.params.conversationId, {
      lastMessage: req.body.content,
      lastUpdated: Date.now(),
    })

    res.status(201).json(message)
  },

  getConversations: async (req, res) => {
    const conversations = await Conversation.find({
      participants: req.user.id,
    }).populate('participants', 'name avatarUrl')
    res.json(conversations)
  },

  getMessages: async (req, res) => {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    }).sort('createdAt')
    res.json(messages)
  },
}
