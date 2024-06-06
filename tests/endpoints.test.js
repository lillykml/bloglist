const { test, beforeEach, after, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helpers = require('../tests/test_helpers')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = helpers.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)

    await User.deleteMany({})
    const userObject = new User(await helpers.getInitialUser())
    const initialUser = await userObject.save()
    const token = await helpers.getUserToken({ id: initialUser._id, username: initialUser.username })
    global.testToken = token  // Storing token globally to use in tests
})

describe('Get Requests', () => {
    test('blogs are returned as json', async () => {
        await api
          .get('/api/blogs')
          .expect(200)
          .expect('Content-Type', /application\/json/)
    })
    
    test('correct number of blogs is returned', async () => {
       const response = await api.get('/api/blogs')
       assert.strictEqual(response.body.length, helpers.initialBlogs.length)
    })
    
    test('id property is named correctly', async () => {
        const response = await api.get('/api/blogs')
        response.body.forEach(blog => {
            assert(blog.hasOwnProperty('id'))
        })
    })    
})

describe('Post Requests', () => {

    test('New blog is added to the db', async () => {

        const newBlog = {
            title: "New Post is here",
            author: "Michael Chan Jr.",
            url: "https://reactpatterns.com/",
            likes: 4,
        }

        
        await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${global.testToken}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, helpers.initialBlogs.length + 1)
        const titles = response.body.map(r => r.title)
        assert(titles.includes('New Post is here'))
    })

    test('Like property defaults to 0 if missing', async () => {
        const newBlog = {
            title: "New Post with no likes",
            author: "Michael Chan Jr.",
            url: "https://reactpatterns.com/",
        }

        const response = await api.post('/api/blogs').set('Authorization', `Bearer ${global.testToken}`).send(newBlog)
        assert(response.body.hasOwnProperty('likes'))
        assert.strictEqual(response.body.likes, 0)
    })

    test('Missing blog title is rejected', async() => {
        const newBlog = {
            author: "Michael Chan Jr.",
            url: "https://reactpatterns.com/",
        }

        await api.post('/api/blogs').set('Authorization', `Bearer ${global.testToken}`).send(newBlog).expect(400)
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, helpers.initialBlogs.length)
    })

    test('Missing blog url is rejected', async() => {
        const newBlog = {
            title: "New Post with no URL",
            author: "Michael Chan Jr.",
        }

        await api.post('/api/blogs').set('Authorization', `Bearer ${global.testToken}`).send(newBlog).expect(400)
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, helpers.initialBlogs.length)
    })
})

// test('Deleting a ressource works correctly', async() => {
//     const blogsBeginning = await api.get('/api/blogs')
//     const idToDelete = blogsBeginning.body[0].id
//     await api.delete(`/api/blogs/${idToDelete}`).set('Authorization', `Bearer ${global.testToken}`).expect(204)
//     const blogsEnd = await api.get('/api/blogs')
//     assert.strictEqual(blogsEnd.body.length, blogsBeginning.body.length-1)
// })

test('Updating a ressource works', async() => {
    const allBlogs = await api.get('/api/blogs')
    const idToUpdate = allBlogs.body[0].id
    const editedBlog = await api.put(`/api/blogs/${idToUpdate}`).send({likes: 10})
    assert.strictEqual(editedBlog.body.likes, 10)
    assert.strictEqual(editedBlog.body.id, idToUpdate)
})

after(async () => {
    await mongoose.connection.close()
})