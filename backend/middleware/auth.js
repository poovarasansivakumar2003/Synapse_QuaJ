import jwt from 'jsonwebtoken'
import debug from 'debug'

const debugLog = debug('app:auth')

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    debugLog('Authentication failed: No token provided')
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    debugLog(`Authenticated user: ${req.user.id} (${req.user.role})`)
    next()
  } catch (err) {
    debugLog('Token verification failed:', err.message)
    res.status(401).json({ error: 'Invalid token' })
  }
}

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    debugLog(
      `Authorization failed: User ${req.user.id} lacks required roles [${roles}]`
    )
    return res.status(403).json({ error: 'Forbidden' })
  }  next()
}

export const universityContext = (req, res, next) => {
  req.universityFilter = { university: req.user.university }
  debugLog(`University context set: ${req.user.university}`)
  next()
}
