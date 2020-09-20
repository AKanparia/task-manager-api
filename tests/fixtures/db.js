const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/modals/user')
const Task = require('../../src/modals/task')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
  _id: userOneId,
  name: 'Mike',
  email: 'mike@example.com',
  password: 'mikePwd@777',
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    },
  ],
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
  _id: userTwoId,
  name: 'Mia',
  email: 'Mia@example.com',
  password: 'MiaPwd@777',
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
    },
  ],
}

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: '1st task',
  completed: false,
  owner: userOne._id,
}

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: '2nd task',
  completed: true,
  owner: userOne._id,
}

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: '3rd task',
  completed: true,
  owner: userTwo._id,
}

const setUpDb = async () => {
  await User.deleteMany()
  await new User(userOne).save()
  await new User(userTwo).save()

  await Task.deleteMany()
  await new Task(taskOne).save()
  await new Task(taskTwo).save()
  await new Task(taskThree).save()
}

module.exports = {
  userOne,
  userOneId,
  userTwo,
  userTwoId,
  taskOne,
  taskTwo,
  taskThree,
  setUpDb,
}
