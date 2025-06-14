import Mentorship from '../models/Mentorship.model.js';
import debugLib from 'debug';

const debug = debugLib('app:mentorship');

const mentorshipController = {
  getActiveMentorships: async (req, res) => {
    try {
      debug(`🤝 Fetching active mentorships for: ${req.user.id}`);
      const mentorships = await Mentorship.find({
        $or: [{ student: req.user.id }, { alumni: req.user.id }],
        status: 'accepted',
      }).populate('student alumni');
      res.json(mentorships);
    } catch (err) {
      debug('❌ Mentorships fetch error:', err.message);
      res.status(500).json({ error: 'Server error' });
    }
  },
};

export default mentorshipController;
