import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleBlogChange = (e) => {
    setNewBlog(e.target.value)
  }

  const handleAuthorChange = (e) => {
    setNewAuthor(e.target.value)
  }

  const handleUrlChange = (e) => {
    setNewUrl(e.target.value)
  }

  const addBlog = (e) => {
    e.preventDefault()
    createBlog({
      title: newBlog,
      author: newAuthor,
      url: newUrl
    })
    setNewBlog('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <form onSubmit={addBlog}>
      <div>
        title:
        <input
          value={newBlog}
          onChange={handleBlogChange}
          placeholder="write here title content"
        />
      </div>
      <div>
        author:
        <input
          value={newAuthor}
          onChange={handleAuthorChange}
          placeholder="write here author content"
        />
      </div>
      <div>
        url:
        <input
          value={newUrl}
          onChange={handleUrlChange}
          placeholder="write here url content"
        />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default BlogForm
