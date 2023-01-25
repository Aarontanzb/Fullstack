import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
require('express-async-errors')

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      blogs.sort((a, b) => (a.likes < b.likes ? 1 : -1))
      setBlogs(blogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password
      })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogAppUser')
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    setErrorMessage(
      `a new blog ${blogObject.title} by ${blogObject.author} added`
    )
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)

    blogService.create(blogObject).then((returnedBlog) => {
      setBlogs(blogs.concat({ ...returnedBlog, user: user }))
    })
  }

  const handleLike = async (id) => {
    const blogObject = blogs.find((blog) => blog.id === id)
    const newBlog = {
      ...blogObject,
      likes: blogObject.likes + 1,
      user: user.id
    }
    delete newBlog.id
    await blogService.update(id, newBlog)
    setBlogs(
      blogs.map((blog) =>
        blog.id === blogObject.id
          ? { ...blog, likes: blog.likes > 0 ? blog.likes + 1 : 1 }
          : blog
      )
    )
  }

  const handleDelete = async (id) => {
    const blogObject = blogs.find((blog) => blog.id === id)
    if (
      window.confirm(`Remove ${blogObject.title} by ${blogObject.author} ?`)
    ) {
      blogService.remove(id)
      setBlogs(blogs.filter((blog) => blog !== blogObject))
    }
  }

  return (
    <div>
      {user === null ? (
        <div>
          <h1>log in to application</h1>
          <Notification message={errorMessage} />
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </div>
      ) : (
        <div>
          <h1>blogs</h1>
          <Notification message={errorMessage} />
          <p>
            {user.name} logged in
            <button onClick={handleLogout}>logout</button>
          </p>
          <h1>create new</h1>
          <Togglable buttonLabel="create new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
        </div>
      )}

      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          handleLike={() => handleLike(blog.id)}
          handleDelete={() => handleDelete(blog.id)}
        />
      ))}
    </div>
  )
}

export default App
