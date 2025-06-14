const express = require('express')
const router = express.Router()
const controller = require('../controllers/mentorshipController')
const auth = require('../middleware/auth')
router.use(auth.authenticate)
router.get('/active', controller.getActiveMentorships)
module.exports = router
