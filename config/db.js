const mongoose = require('mongoose')


console.log(process.env.MONGODB_URI)
// module.exports = connectDB => async () => {
//   try {
//     const databaseConnection = await mongoose.connect(process.env.MONGOURI)
//   } catch (error) {
//     console.log(`ERROR::: ${error.message}`) 
//     process.exit(1)   
//   }
// }