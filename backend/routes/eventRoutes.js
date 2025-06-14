const express = require('express')
const router = express.Router()
const controller = require('../controllers/eventController')
const auth = require('../middleware/auth')

router.use(auth.authenticate)
router.post('/', controller.createEvent)
router.get('/', controller.getEvents)
router.post('/:id/rsvp', controller.rsvpEvent)

module.exports = router
