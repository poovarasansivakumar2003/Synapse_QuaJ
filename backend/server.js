import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

const startServer = async () => {
  try {
    console.log('Starting server...')
    await connectDB()
    console.log('✅ Database connected successfully')

    app.use(express.json())

    // Optional test route
    app.get('/ping', (req, res) => res.send('pong'))

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`)
    })
  } catch (error) {
    console.error(`❌ Error starting server: ${error.message}`)
    process.exit(1)
  }
}

startServer()
