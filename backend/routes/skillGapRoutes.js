const router = require('express').Router()
const controller = require('../controllers/skillGapController')
const auth = require('../middleware/auth')

router.use(auth.authenticate)
router.use(auth.authorize('admin'))

router.post('/calculate', controller.calculateSkillGaps)

module.exports = router
