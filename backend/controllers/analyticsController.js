const Analytics = require('../models/Analytics.model')
const { Parser } = require('json2csv')

module.exports = {
  getDashboardData: async (req, res) => {
    const data = await Analytics.find({
      university: req.user.university,
      type: { $in: ['user_engagement', 'skill_gap', 'placement'] },
    }).sort('-generatedAt')

    res.json(data)
  },

  exportData: async (req, res) => {
    const { type } = req.params
    const data = await Analytics.find({
      university: req.user.university,
      type,
    })

    // Convert to CSV
    const fields = ['type', 'generatedAt', 'data']
    const parser = new Parser({ fields })
    const csv = parser.parse(data)

    res.header('Content-Type', 'text/csv')
    res.attachment(`${type}-analytics.csv`)
    res.send(csv)
  },
}
