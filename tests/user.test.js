const request = require('supertest')
const app = require('../src/app')
const User = require('../src/modals/user')
const { userOne, userOneId, setUpDb } = require('./fixtures/db')

beforeEach(setUpDb)

test('Should signup a new user', async () => {
  const res = await request(app)
    .post('/users')
    .send({
      name: 'Abhishek K.',
      email: 'abhishek@test.com',
      password: 'myPass#123!',
    })
    .expect(201)

  //Assert that the database was changed correctly
  const user = await User.findById(res.body.user._id)
  expect(user).not.toBeNull()

  //Assert about response body
  expect(res.body).toMatchObject({
    user: {
      name: 'Abhishek K.',
      email: 'abhishek@test.com',
    },
    token: user.tokens[0].token,
  })

  //Assert that plain password is not stored
  expect(user.password).not.toBe('myPass#123!')
})

test('Should login existing user', async () => {
  const res = await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200)

  //Assert that new token was generated and stored in Db.
  const user = await User.findById(userOneId)
  expect(res.body.token).toBe(user.tokens[1].token)
})

test('Should not login non-existent user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: 'badEmail@text.com',
      password: 'badPassword',
    })
    .expect(400)
})

test('Should not login user with invaild credentials ', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: 'badPassword',
    })
    .expect(400)
})

test('Should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
  await request(app).get('/users/me').send().expect(401)
})

test('Should delete user account', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

  //Assert to check user was deleted from DB
  const user = await User.findById(userOneId)
  expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async () => {
  await request(app).delete('/users/me').send().expect(401)
})

test('Should upload avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/philly.jpg')
    .expect(200)

  const user = await User.findById(userOneId)
  expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should not upload invalid files for avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/fall.jpg')
    .expect(400)
})

test('Should not upload invalid files for avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/sample-pdf-file.pdf')
    .expect(400)
})

test('Should upadte valid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: 'Mia',
    })
    .expect(200)

  const user = await User.findById(userOneId)
  expect(user.name).toEqual('Mia')
})

test('Should not upadte invalid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: 'Mumbai',
    })
    .expect(400)
})
