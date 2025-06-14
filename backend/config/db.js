const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const connectDB = async () => {
  try {
    console.log('✅ MONGODB_URI:', process.env.MONGODB_URI);
    console.log('🔗 Connecting to MongoDB...')
    const conn = await mongoose.connect(process.env.MONGODB_URI)

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    console.log(`📊 Database Name: ${conn.connection.name}`)
    console.log(`🔌 Port: ${conn.connection.port}`)
    console.log(
      `📚 Collections: ${Object.keys(conn.connection.collections).length}`
    )

    return conn
  } catch (error) {
    console.error(`❌ Connection Error: ${error.message}`)
    process.exit(1)
  }
}

module.exports = connectDB
