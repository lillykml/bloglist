const jwt = require('jsonwebtoken')
const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')


blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
  response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })
  response.json(blog)
})
  
blogRouter.post('/', async (request, response) => {

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const user = request.user

    if (decodedToken) {

      const blogData = {
      ...request.body,
      user: user.id}
    
    const blog = new Blog(blogData)
    const result = await blog.save()
    user.blogs = user.blogs.concat(blog._id)
    await user.save()
    console.log(result)
    const populatedBlog = await Blog.findById(result._id).populate('user', { username: 1, name: 1 })
    response.status(201).json(populatedBlog) 
    }
})

blogRouter.delete('/:id', async (request, response) => {

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (decodedToken) {
    const blog = await Blog.findById(request.params.id)
    if (blog.user.toString() === request.user.id) {
      await Blog.findByIdAndDelete(request.params.id)
      response.status(204).end()
    }
  }
})

blogRouter.put('/:id', async (request, response) => {

  const blog = {
    likes: request.body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true}).populate('user', { username: 1, name: 1 })
  response.json(updatedBlog)
})

module.exports = blogRouter