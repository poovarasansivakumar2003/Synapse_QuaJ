const express = require('express');
const Meeting = require('../models/Meeting');
const auth = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Schedule a meeting
router.post('/schedule', auth, async (req, res) => {
  try {
    const { title, description, participantId, scheduledTime, duration } = req.body;
    
    const meeting = new Meeting({
      title,
      description,
      organizer: req.user.userId,
      participant: participantId,
      scheduledTime: new Date(scheduledTime),
      duration,
      meetingLink: `${process.env.CLIENT_URL}/meeting/${uuidv4()}`
    });

    await meeting.save();
    await meeting.populate(['organizer', 'participant'], 'name email profile.profilePicture');

    res.status(201).json(meeting);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's meetings
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const meetings = await Meeting.find({
      $or: [
        { organizer: userId },
        { participant: userId }
      ]
    })
    .populate(['organizer', 'participant'], 'name email profile.profilePicture')
    .sort({ scheduledTime: 1 });

    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update meeting status
router.put('/:meetingId/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const meetingId = req.params.meetingId;
    
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    // Check if user is organizer or participant
    if (meeting.organizer.toString() !== req.user.userId && 
        meeting.participant.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    meeting.status = status;
    await meeting.save();

    res.json(meeting);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
