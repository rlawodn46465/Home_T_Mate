const mongoose = require('mongoose');

require('dotenv').config();

const connectDB = async () => {
  try{
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`🔌 MongoDB 연결: ${conn.connection.host}`)
  } catch (error) {
    console.error(`🚨 Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;