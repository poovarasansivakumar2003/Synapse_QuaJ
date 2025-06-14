import Notification from '../models/Notification.model.js';
import Message from '../models/Message.model.js';

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id, isRead: false });
    res.json({ count: notifications.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ userId: req.user.id, isRead: false });
    res.json({ count: messages.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};
