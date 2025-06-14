const User = require('../models/User.model')

module.exports = {
  searchAlumni: async (req, res) => {
    const { q, skills, company, batch } = req.query
    const query = {
      university: req.user.university,
      role: 'alumni',
    }

    if (q) query.$text = { $search: q }
    if (skills) query.skills = { $in: skills.split(',') }
    if (company) query.company = new RegExp(company, 'i')
    if (batch) query.batch = batch

    const results = await User.find(query)
      .select('name avatarUrl company position skills batch')
      .limit(20)

    res.json(results)
  },
}
