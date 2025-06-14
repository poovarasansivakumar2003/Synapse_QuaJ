const jwt = require('jsonwebtoken')
const debug = require('debug')('app:auth')

module.exports = {
  authenticate: (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      debug('Authentication failed: No token provided')
      return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET)
      debug(`Authenticated user: ${req.user.id} (${req.user.role})`)
      next()
    } catch (err) {
      debug('Token verification failed:', err.message)
      res.status(401).json({ error: 'Invalid token' })
    }
  },

  authorize:
    (...roles) =>
    (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        debug(
          `Authorization failed: User ${req.user.id} lacks required roles [${roles}]`
        )
        return res.status(403).json({ error: 'Forbidden' })
      }
      next()
    },

  universityContext: (req, res, next) => {
    req.universityFilter = { university: req.user.university }
    debug(`University context set: ${req.user.university}`)
    next()
  },
}
