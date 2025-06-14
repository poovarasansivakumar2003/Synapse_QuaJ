import User from '../models/User.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import debugLib from 'debug'

const debug = debugLib('app:auth')

export const register = async (req, res) => {
  try {
    const user = await User.create(req.body)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    res.status(201).json({ token, user })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email }).select('+password')

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({ token, user })
  } catch (err) {
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
