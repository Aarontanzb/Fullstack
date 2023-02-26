import { useEffect, useRef } from 'react'
import loginService from './services/login'
import storageService from './services/storage'
import {
  useNotificationDispatch,
  useNotificationValue
} from './NotificationContext'
import { useLoginDispatch, useLoginValue } from './LoginContext'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getBlogs, createBlog, updateBlog, removeBlog } from './requests'

import Blog from './components/Blog'
import LoginForm from './components/Login'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
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

  const result = useQuery('blogs', getBlogs)

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
  }

  const like = async (blog) => {
    updateBlogMutation.mutate({
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id
    })
    notifyWith(`A like for the blog '${blog.title}' by '${blog.author}'`)
  }

  const remove = async (blog) => {
    const ok = window.confirm(
      `Sure you want to remove '${blog.title}' by ${blog.author}`
    )
    if (ok) {
      removeBlogMutation.mutate(blog.id)
      notifyWith(`The blog' ${blog.title}' by '${blog.author} removed`)
    }
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

  return (
    <div>
      <h2>blogs</h2>
      <Notification info={notification} />
      <div>
        {user.name} logged in
        <button onClick={logout}>logout</button>
      </div>
      <Togglable buttonLabel="new note" ref={blogFormRef}>
        <NewBlog addBlog={addBlog} />
      </Togglable>
      <div>
        {allBlogs.sort(byLikes).map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            like={() => like(blog)}
            canRemove={user && blog.user.username === user.username}
            remove={() => remove(blog)}
          />
        ))}
      </div>
    </div>
  )
}

export default App
