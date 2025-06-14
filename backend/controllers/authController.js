import User from '../models/User.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import debugLib from 'debug'

const debug = debugLib('app:auth')

export const register = async (req, res) => {
  try {
    debug(`Registration attempt: ${req.body.email}`)
    const user = await User.create(req.body)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    debug(`User registered: ${user._id}`)

    const sanitizedUser = user.toObject()
    delete sanitizedUser.password

    res.status(201).json({ token, user: sanitizedUser })
  } catch (err) {
    debug('Registration error:', err.message)
    res.status(400).json({ error: err.message })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body
  debug(`Login attempt: ${email}`)

  try {
    const user = await User.findOne({ email }).select('+password')

    if (!user || !(await bcrypt.compare(password, user.password))) {
      debug('Login failed: Invalid credentials')
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    if (!user.isVerified && user.role !== 'admin') {
      debug('Login failed: User not verified')
      return res.status(403).json({ error: 'Account not verified' })
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, university: user.university },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    debug(`User logged in: ${user._id}`)

    const sanitizedUser = user.toObject()
    delete sanitizedUser.password

    res.json({ token, user: sanitizedUser })
  } catch (err) {
    debug('Login error:', err.message)
    res.status(500).json({ error: 'Server error' })
  }
}

export const getProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    debug(`Fetching profile for: ${req.user.id}`)
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(user)
  } catch (err) {
    debug('Profile fetch error:', err.message)
    res.status(500).json({ error: 'Server error' })
  }
}
