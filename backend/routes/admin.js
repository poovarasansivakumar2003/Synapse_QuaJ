const express = require('express');
const User = require('../models/User');
const Video = require('../models/Video');
const Meeting = require('../models/Meeting');
const Chat = require('../models/Chat');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/admin');

const router = express.Router();

// Get dashboard statistics
router.get('/stats', auth, adminAuth, async (req, res) => {
  try {
    const stats = {
      totalUsers: await User.countDocuments(),
      totalStudents: await User.countDocuments({ role: 'student' }),
      totalAlumni: await User.countDocuments({ role: 'alumni' }),
      totalMeetings: await Meeting.countDocuments(),
      totalChats: await Chat.countDocuments(),
      totalVideos: await Video.countDocuments(),
      recentUsers: await User.find()
        .select('-password')
        .sort({ createdAt: -1 })
        .limit(5),
      recentMeetings: await Meeting.find()
        .populate(['organizer', 'participant'], 'name email')
        .sort({ createdAt: -1 })
        .limit(5)
    };

    // User growth data for chart
    const userGrowthData = await User.aggregate([
      {
        $group: {
          _id: { 
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
            role: '$role'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    stats.userGrowthData = userGrowthData;
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all users with pagination
router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    
    let query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user verification status
router.put('/users/:userId/verify', auth, adminAuth, async (req, res) => {
  try {
    const { verified } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { 'profile.isVerified': verified },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete user
router.delete('/users/:userId', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Clean up related data
    await Chat.deleteMany({ participants: req.params.userId });
    await Meeting.deleteMany({
      $or: [
        { organizer: req.params.userId },
        { participant: req.params.userId }
      ]
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Video management
router.get('/videos', auth, adminAuth, async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/videos', auth, adminAuth, async (req, res) => {
  try {
    const video = new Video(req.body);
    await video.save();
    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/videos/:videoId', auth, adminAuth, async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.videoId,
      req.body,
      { new: true }
    );
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/videos/:videoId', auth, adminAuth, async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.videoId);
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
