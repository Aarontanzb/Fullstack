const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog))
  const promiseArray = blogObjects.map((blog) => blog.save())
  await Promise.all(promiseArray)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0,
    },
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('when list has multiple blogs', () => {
    const result = listHelper.totalLikes(helper.initialBlogs)
    expect(result).toBe(36)
  })
})

describe('highest likes', () => {
  test('blog with highest likes', () => {
    expect(listHelper.favoriteBlog(helper.initialBlogs)).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    })
  })
})

describe('author with highest number of blogs', () => {
  test('blog author with most blogs', () => {
    expect(listHelper.mostBlogs(helper.initialBlogs)).toEqual({
      author: 'Robert C. Martin',
      blogs: 3,
    })
  })
})

describe('author with highest total number of likes', () => {
  test('blog author with most total likes', () => {
    expect(listHelper.mostLikes(blogs)).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17,
    })
  })
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('id exists for blogs', async () => {
  const blogs = await Blog.find({})
  for (const blog of blogs) {
    expect(blog._id).toBeDefined()
  }
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'TDD architecture',
    author: 'Robert C.',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Architecture.html',
    likes: 1,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map((n) => n.title)
  expect(titles).toContain('TDD architecture')
})

test('request with no likes defaults to 0', async () => {
  const newBlog = {
    title: 'TDDD architecture',
    author: 'Robert C',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TD-Architecture.html',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  const postedBlog = blogsAtEnd.slice(-1)
  console.log(postedBlog)
  expect(postedBlog[0].likes).toBe(0)
})

test('blog without URL is not added', async () => {
  const newBlog = {
    title: 'TDD architecture',
    author: 'Robert C.',
    likes: 1,
  }

  await api.post('/api/blogs').send(newBlog).expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

afterAll(() => {
  mongoose.connection.close()
})
