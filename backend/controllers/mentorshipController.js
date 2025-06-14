const Mentorship = require('../models/Mentorship.model')
const debug = require('debug')('app:mentorship')

module.exports = {
  getActiveMentorships: async (req, res) => {
    try {
      debug(`🤝 Fetching active mentorships for: ${req.user.id}`)
      const mentorships = await Mentorship.find({
        $or: [{ student: req.user.id }, { alumni: req.user.id }],
        status: 'accepted',
      }).populate('student alumni')
      res.json(mentorships)
    } catch (err) {
      debug('❌ Mentorships fetch error:', err.message)
      res.status(500).json({ error: 'Server error' })
    }
  },
}
