const bcrypt = require('bcrypt')
const { test, beforeEach, after, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helpers = require('./test_helpers')

const api = supertest(app)

describe('One user in the db', () => {

    beforeEach(async () => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({
            name: "Nickool",
            username: "NickNack",
            passwordHash: passwordHash
        })
        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helpers.usersInDb()
    
        const newUser = {
          username: 'mluukkai',
          name: 'Matti Luukkainen',
          password: 'salainen',
        }
    
        await api
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .expect('Content-Type', /application\/json/)
    
        const usersAtEnd = await helpers.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
    
        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
      })

      test('creation fails for missing username', async()=>{
        const usersAtStart = await helpers.usersInDb()

        const newUser = {
            name: 'Matti Luukkainen',
            password: 'salainen',
          }

        await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
        
        const usersAtEnd = await helpers.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
      })

      test('creation fails for invalid username', async()=>{
        const usersAtStart = await helpers.usersInDb()

        const newUser = {
            username: 'Ma',
            name: 'Matti Luukkainen',
            password: 'salainen',
          }

        await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
        
        const usersAtEnd = await helpers.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
      })

      test.only('creation fails for non-unique username', async()=>{
        const usersAtStart = await helpers.usersInDb()

        const newUser = {
            username: "NickNack",
            name: 'Matti Luukkainen',
            password: 'salainen',
          }

        await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
        
        const usersAtEnd = await helpers.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
      })

      test('creation fails for missing password', async()=>{
        const usersAtStart = await helpers.usersInDb()

        const newUser = {
            username: "NickNack",
            name: 'Matti Luukkainen',
          }

        await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
        
        const usersAtEnd = await helpers.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
      })

      test('creation fails for too-short password', async()=>{
        const usersAtStart = await helpers.usersInDb()

        const newUser = {
            username: "NickNack",
            name: 'Matti Luukkainen',
            password: 'sa',
          }

        await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
        
        const usersAtEnd = await helpers.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
      })
})

after(async () => {
    await mongoose.connection.close()
})
