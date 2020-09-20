const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/modals/task')
const {
  userOne,
  userOneId,
  userTwo,
  userTwoId,
  taskOne,
  taskTwo,
  taskThree,
  setUpDb,
} = require('./fixtures/db')

beforeEach(setUpDb)

test('Should create task for user', async () => {
  const res = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ description: 'Add a task' })
    .expect(201)

  const task = await Task.findById(res.body._id)
  expect(task).not.toBeNull()
  expect(task.completed).toEqual(false)
  expect(task.owner).toEqual(userOneId)
})

test('Should fetch user tasks', async () => {
  const res = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

  expect(res.body.length).toEqual(2)
})

test('Should not delete other user tasks', async () => {
  const res = await request(app)
    .delete(`/tasks/${taskThree._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(404)

  const task = await Task.findById(taskThree._id)
  expect(task).not.toBeNull()
})
