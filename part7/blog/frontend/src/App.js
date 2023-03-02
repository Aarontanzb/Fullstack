import { useEffect, useRef } from 'react'
import loginService from './services/login'
import storageService from './services/storage'
import {
  useNotificationDispatch,
  useNotificationValue
} from './NotificationContext'
import { useLoginDispatch, useLoginValue } from './LoginContext'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import {
  getBlogs,
  createBlog,
  updateBlog,
  removeBlog,
  getUsers
} from './requests'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useMatch
} from 'react-router-dom'
import { Navbar, Nav } from 'react-bootstrap'

import Blogs from './components/Blogs'
import LoginForm from './components/Login'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const padding = {
    padding: 5
  }

  const blogFormRef = useRef()

  const nDispatch = useNotificationDispatch()
  const notification = useNotificationValue()

  const lDispatch = useLoginDispatch()
  const user = useLoginValue()

  useEffect(() => {
    const user = storageService.loadUser()
    lDispatch({
      type: 'SET',
      payload: user
    })
  }, [])

  const queryClient = useQueryClient()

  const newBlogMutation = useMutation(createBlog, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
    }
  })

  const updateBlogMutation = useMutation(updateBlog, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
    }
  })

  const removeBlogMutation = useMutation(removeBlog, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
    }
  })

  const resultUser = useQuery('users', getUsers)
  const allUsers = resultUser.data

  const result = useQuery('blogs', getBlogs)

  if (resultUser.isLoading) {
    return <div>loading data...</div>
  }

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  const allBlogs = result.data

  const notifyWith = (message) => {
    nDispatch({
      type: 'SET',
      payload: message
    })

    setTimeout(() => {
      nDispatch({ type: 'SET', payload: null })
    }, 3000)
  }

  const login = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      lDispatch({
        type: 'SET',
        payload: user
      })
      storageService.saveUser(user)
      notifyWith('welcome!')
    } catch (e) {
      notifyWith('wrong username or password', 'error')
    }
  }

  const logout = async () => {
    lDispatch({
      type: 'SET',
      payload: null
    })
    storageService.removeUser()
    notifyWith('logged out')
  }

  const addBlog = (newBlog) => {
    notifyWith(`A new blog '${newBlog.title}' by '${newBlog.author}' added`)
    blogFormRef.current.toggleVisibility()
    newBlogMutation.mutate({ newBlog })
    console.log(newBlog)
  }

  if (!user) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification info={notification} />
        <LoginForm login={login} />
      </div>
    )
  }

  const byLikes = (b1, b2) => b2.likes - b1.likes

  const Home = () => {
    return (
      <div>
        <h2>blogs</h2>
        <Notification info={notification} />
        <div></div>
        <Togglable buttonLabel="create new" ref={blogFormRef}>
          <NewBlog addBlog={addBlog} />
        </Togglable>
        <div>
          {allBlogs.sort(byLikes).map((blog) => (
            <Blogs blog={blog} key={blog.id} />
          ))}
        </div>
      </div>
    )
  }

  const Users = () => {
    return (
      <div>
        <h2>blogs</h2>
        <div>
          <button onClick={logout}>logout</button>
        </div>
        <h2>Users</h2>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>blogs created</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </td>
                <td>{user.blogs.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const User = ({ users }) => {
    const id = useParams().id
    const blogger = users.find((u) => u.id === id)
    return (
      <div>
        <h2>blogs</h2>
        <div>
          <button onClick={logout}>logout</button>
        </div>
        <h2>{blogger.name}</h2>
        <h3>added blogs</h3>
        <ul>
          {blogger.blogs.map((blog) => (
            <li key={blog.id}>{blog.title}</li>
          ))}
        </ul>
      </div>
    )
  }

  const Blog = () => {
    const match = useMatch('/blogs/:id')

    const blog = match
      ? allBlogs.find((blog) => blog.id === match.params.id)
      : null

    const remove = async () => {
      const ok = window.confirm(
        `Sure you want to remove '${blog.title}' by ${blog.author}`
      )
      if (ok) {
        removeBlogMutation.mutate(blog.id)
        notifyWith(`The blog' ${blog.title}' by '${blog.author} removed`)
        window.location.href = 'http://localhost:3000/'
      }
    }

    const like = async () => {
      updateBlogMutation.mutate({
        ...blog,
        likes: blog.likes + 1,
        user: blog.user.id
      })
      notifyWith(`A like for the blog '${blog.title}' by '${blog.author}'`)
    }

    const canRemove = () => {
      user && blog.user.username === user.username
    }

    return (
      <div className="container">
        <h2>blogs</h2>
        <div>
          <button onClick={logout}>logout</button>
        </div>
        <h2>
          {blog.title} {blog.author}
        </h2>

        <div>
          <div>
            {' '}
            <a href={blog.url}> {blog.url}</a>{' '}
          </div>
          <div>
            likes {blog.likes} <button onClick={like}>like</button>
          </div>
          <div>{blog.user && blog.user.name}</div>
          {canRemove && <button onClick={remove}>delete</button>}
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#" as="span">
              <Link style={padding} to="/">
                blogs
              </Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              <Link style={padding} to="/users">
                users
              </Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              {user ? (
                <>
                  <span>{user.name} logged in</span>{' '}
                  <button onClick={logout}>logout</button>{' '}
                </>
              ) : null}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User users={allUsers} />} />
        <Route path="/blogs/:id" element={<Blog />} />
      </Routes>
    </Router>
  )
}

export default App
