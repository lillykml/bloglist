const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0
  }
]

const blogList = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

describe('total likes', () => {

  test('returns 0 with empty list', () => {
    assert.strictEqual(listHelper.totalLikes([]), 0)
  })

  test('returns the number of likes for 1 blog post', () => {
    assert.strictEqual(listHelper.totalLikes(listWithOneBlog), 5)
  })

  test('calculates correctly for longer list', () => {
    assert.strictEqual(listHelper.totalLikes(blogList), 36)
  })
})

describe('favorite blog', () => {

  test('returns an empty object for no blogs', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog([]), {})
  })

  test('returns the blog for one blog', () => {
    const expectedFavorite = {
      title: listWithOneBlog[0].title,
      author: listWithOneBlog[0].author,
      likes: listWithOneBlog[0].likes
    }

    assert.deepStrictEqual(listHelper.favoriteBlog(listWithOneBlog), expectedFavorite)
  })

  test('returns the correct for longer list', () => {
    const expectedFavorite = {
      title: blogList[2].title,
      author: blogList[2].author,
      likes: blogList[2].likes
    }

    assert.deepStrictEqual(listHelper.favoriteBlog(blogList), expectedFavorite)
  })
})

describe('most blogs', () => {
  test('returns an empty object for no blogs', () => {
    assert.deepStrictEqual(listHelper.mostBlogs([]), {})
  })

  test('returns the correct author for a longer list', () => {
    const expectedAuthor = {
      author: "Robert C. Martin",
      blogs: 3
    }

    assert.deepStrictEqual(listHelper.mostBlogs(blogList), expectedAuthor)
  })
})

describe('most likes', () => {
  test('returns an empty object for no blogs', () => {
    assert.deepStrictEqual(listHelper.mostLikes([]), {})
  })

  test('returns the correct author and likesfor a longer list', () => {
    const expectedAuthor = {
      author: "Edsger W. Dijkstra",
      likes: 17
    }

    assert.deepStrictEqual(listHelper.mostLikes(blogList), expectedAuthor)
  })
})