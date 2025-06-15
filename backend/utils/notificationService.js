const Notification = require('../models/Notification');

class NotificationService {
  static async createNotification(data) {
    try {
      const notification = new Notification(data);
      await notification.save();
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  static async sendMessageNotification(senderId, recipientId, message) {
    return this.createNotification({
      recipient: recipientId,
      sender: senderId,
      type: 'message',
      title: 'New Message',
      message: `You have a new message: ${message.substring(0, 50)}...`,
      data: { messageId: message._id }
    });
  }

  static async sendMeetingNotification(organizerId, participantId, meeting, type = 'scheduled') {
    const titles = {
      scheduled: 'Meeting Scheduled',
      reminder: 'Meeting Reminder',
      cancelled: 'Meeting Cancelled'
    };

    const messages = {
      scheduled: `A new meeting "${meeting.title}" has been scheduled`,
      reminder: `Reminder: "${meeting.title}" is starting soon`,
      cancelled: `Meeting "${meeting.title}" has been cancelled`
    };

    return this.createNotification({
      recipient: participantId,
      sender: organizerId,
      type: 'meeting',
      title: titles[type],
      message: messages[type],
      data: { meetingId: meeting._id, meetingType: type }
    });
  }

  static async sendConnectionNotification(senderId, recipientId) {
    return this.createNotification({
      recipient: recipientId,
      sender: senderId,
      type: 'connection',
      title: 'New Connection Request',
      message: 'Someone wants to connect with you',
      data: { senderId }
    });
  }

  static async sendSystemNotification(recipientId, title, message) {
    return this.createNotification({
      recipient: recipientId,
      type: 'system',
      title,
      message
    });
  }
}

module.exports = NotificationService;
