const express = require('express')
const router = express.Router()
const controller = require('../controllers/achievementController')
const auth = require('../middleware/auth')

router.use(auth.authenticate)
router.get('/', controller.getAchievements)
router.post('/', controller.unlockAchievement)

module.exports = router
