import User from '../models/User.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import debug from 'debug'

const debugLog = debug('app:auth')

export const register = async (req, res) => {
  try {
    debugLog(`Registration attempt: ${req.body.email}`)
    console.log('Register endpoint hit, body:', req.body)
    const user = await User.create(req.body)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    debugLog(`User registered: ${user._id}`)
    res.status(201).json({ token, user })
  } catch (err) {    console.log('Registration error:', err.message)
    res.status(400).json({ error: err.message })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body
  debugLog(`Login attempt: ${email}`)

  try {
    const user = await User.findOne({ email }).select('+password')

    if (!user || !(await bcrypt.compare(password, user.password))) {
      debugLog('Login failed: Invalid credentials')
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    debugLog(`User logged in: ${user._id}`)
    res.json({ token, user })
  } catch (err) {
    debugLog('Login error:', err.message)
    res.status(500).json({ error: 'Server error' })
  }
}

export const getProfile = async (req, res) => {
  try {
    debugLog(`Fetching profile for: ${req.user.id}`)
    const user = await User.findById(req.user.id)
    res.json(user)
  } catch (err) {
    debugLog('Profile fetch error:', err.message)
    res.status(500).json({ error: 'Server error' })
  }
}
