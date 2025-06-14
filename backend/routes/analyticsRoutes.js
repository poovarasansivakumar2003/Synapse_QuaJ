const router = require('express').Router()
const controller = require('../controllers/analyticsController')
const auth = require('../middleware/auth')

router.use(auth.authenticate)
router.use(auth.authorize('admin'))

router.get('/', controller.getDashboardData)
router.get('/export/:type', controller.exportData)

module.exports = router
