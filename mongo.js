require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(process.env.TEST_MONGODB_URI)

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

const blog = new Blog({
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
})

blog.save().then(result => {
    console.log('Saved blog')
    mongoose.connection.close()
})