const express = require('express')
const router = express.Router()
const controller = require('../controllers/jobController')
const auth = require('../middleware/auth')

router.use(auth.authenticate)
router.get('/', controller.getJobs)
router.post('/:id/apply', controller.applyJob)

module.exports = router
