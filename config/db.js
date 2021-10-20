require('dotenv').config({path : '../.env'})
const mongoose = require('mongoose')

console.log(process.env.MONGODB_URI)
module.exports.connectDB = async () => {
  try {
    const databaseConnection = await mongoose.connect(process.env.MONGODB_URI,  { useNewUrlParser: true, useUnifiedTopology: true })
    console.log(`DB connected ::: ${databaseConnection.connection.host}`);
  } catch (error) {
    console.log(`ERROR::: ${error.message}`) 
    process.exit(1)   
  }
}