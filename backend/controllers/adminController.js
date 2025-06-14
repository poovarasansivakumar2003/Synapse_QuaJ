import User from '../models/User.model.js';
import University from '../models/University.model.js';
import SkillGap from '../models/SkillGap.model.js';
import mongoose from 'mongoose';
import debugLib from 'debug';

const debug = debugLib('app:admin');

const adminController = {
  getAllUsers: async (req, res) => {
    try {
      const filter = { university: req.user.university };

      if (req.query.verified === 'false') {
        filter.isVerified = false;
        filter.role = { $ne: 'admin' };
      } else if (req.query.verified === 'true') {
        filter.isVerified = true;
      }

      // Add role filter if specified
      if (req.query.role) {
        filter.role = req.query.role;
      }

      const users = await User.find(filter).select('-password');
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  },
  createUniversity: async (req, res) => {
    try {
      const university = await University.create(req.body);
      res.status(201).json(university);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  verifyUser: async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { isVerified: true },
        { new: true }
      );
      res.json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  generateSkillGapReport: async (req, res) => {
    try {
      const gaps = await SkillGap.find({
        university: req.user.university,
      })
        .sort({ gap: -1 })
        .limit(10);

      res.json({
        university: req.user.university,
        reportDate: new Date(),
        skillGaps: gaps,
      });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  manageUser: async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
        new: true,
      });
      res.json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};

export default adminController;
