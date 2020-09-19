//D:\Workspace\DB\mongodb\bin\mongod.exe --dbpath=D:\Workspace\DB\mongodb-data
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
})
module.exports = mongoose
