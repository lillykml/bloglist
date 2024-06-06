const jwt = require('jsonwebtoken')
const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')


blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
  response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  response.json(blog)
})
  
blogRouter.post('/', async (request, response) => {

    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (decodedToken) {
      const user = await User.findById(decodedToken.id)

      const blogData = {
      ...request.body,
      user: user.id}
    
    const blog = new Blog(blogData)
    const result = await blog.save()
    user.blogs = user.blogs.concat(blog._id)
    await user.save()
    response.status(201).json(result) 
    }
})

blogRouter.delete('/:id', async (request, response) => {

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (decodedToken) {
    const user = await User.findById(decodedToken.id)
    const blog = await Blog.findById(request.params.id)
    if (blog.user.toString() === user.id) {
      await Blog.findByIdAndDelete(request.params.id)
      response.status(204).end()
    }
  }
})

blogRouter.put('/:id', async (request, response) => {

  const blog = {
    likes: request.body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
  response.json(updatedBlog)
})

module.exports = blogRouter