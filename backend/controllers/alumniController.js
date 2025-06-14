import User from '../models/User.model.js';
import Job from '../models/Job.model.js';
import Mentorship from '../models/Mentorship.model.js';
import debugLib from 'debug';

const debug = debugLib('app:alumniController');

const alumniController = {
  updateProfile: async (req, res) => {
    try {
      debug(`updateProfile of alumni: ${req.user.id}`);
      const user = await User.findByIdAndUpdate(req.user.id, req.body, {
        new: true,
        runValidators: true,
      });
      res.json(user);
    } catch (error) {
      debug(`Error updating profile: ${error.message}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  searchAlumni: async (req, res) => {
    try {
      debug(`🔍 Alumni search by: ${req.user.id}`);
      const { branch, batch, company, skills } = req.query;

      const filters = {
        role: 'alumni',
        university: req.user.university,
      };

      if (branch) filters.branch = branch;
      if (batch) filters.batch = parseInt(batch);
      if (company) filters.company = { $regex: company, $options: 'i' };
      if (skills) filters.skills = { $in: skills.split(',') };

      const alumni = await User.find(filters)
        .select('_id name batch branch company skills')
        .limit(20);

      res.json(alumni);
    } catch (err) {
      debug('❌ Alumni search error:', err.message);
      res.status(500).json({ error: 'Server error' });
    }
  },

  postJob: async (req, res) => {
    try {
      debug(`Posting job by alumni: ${req.user.id}`);
      const job = new Job({
        ...req.body,
        postedBy: req.user.id,
        university: req.user.university,
      });
      debug('Job posted:${job._id}');
      res.status(201).json(job);
    } catch (err) {
      debug(`Error posting job: ${err.message}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  getMentorshipRequests: async (req, res) => {
    try {
      const alumniId = req.user.id;
      console.debug(`🔍 Fetching mentorship requests for alumni: ${alumniId}`);

      const requests = await Mentorship.find({
        alumni: alumniId,
        status: 'pending',
      }).populate('student');

      console.debug(`✅ Found ${requests.length} mentorship requests`);
      res.json(requests);
    } catch (err) {
      console.debug(`❌ Error fetching mentorship requests: ${err.message}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  respondToMentorship: async (req, res) => {
    try {
      debug(`📝 Responding to mentorship request ID: ${req.params.id}`);
      debug(`📥 New status: ${req.body.status}`);

      const mentorship = await Mentorship.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
      );

      if (!mentorship) {
        debug(`⚠️ No mentorship request found with ID: ${req.params.id}`);
        return res.status(404).json({ error: 'Mentorship request not found' });
      }

      debug(
        `✅ Updated mentorship status to ${mentorship.status} for student: ${mentorship.student}`
      );

      res.json(mentorship);
    } catch (err) {
      debug(`❌ Mentorship response error: ${err.message}`);
      res.status(400).json({ error: err.message });
    }
  },
};

export default alumniController;
