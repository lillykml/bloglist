const { test, beforeEach, after, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
    {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
    },
    {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
    },
    {
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
    },
    {
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
    },
    {
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
    }  
  ]

beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
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
       assert.strictEqual(response.body.length, initialBlogs.length)
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
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, initialBlogs.length + 1)
        const titles = response.body.map(r => r.title)
        assert(titles.includes('New Post is here'))
    })

    test('Like property defaults to 0 if missing', async () => {
        const newBlog = {
            title: "New Post with no likes",
            author: "Michael Chan Jr.",
            url: "https://reactpatterns.com/",
        }

        const response = await api.post('/api/blogs').send(newBlog)
        assert(response.body.hasOwnProperty('likes'))
        assert.strictEqual(response.body.likes, 0)
    })

    test.only('Missing blog title is rejected', async() => {
        const newBlog = {
            author: "Michael Chan Jr.",
            url: "https://reactpatterns.com/",
        }

        await api.post('/api/blogs').send(newBlog).expect(400)
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, initialBlogs.length)
    })

    test.only('Missing blog url is rejected', async() => {
        const newBlog = {
            title: "New Post with no URL",
            author: "Michael Chan Jr.",
        }

        await api.post('/api/blogs').send(newBlog).expect(400)
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, initialBlogs.length)
    })
})

after(async () => {
    await mongoose.connection.close()
  })