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
          id="title"
          value={newBlog}
          onChange={handleBlogChange}
          placeholder="write here title content"
        />
      </div>
      <div>
        author:
        <input
          id="author"
          value={newAuthor}
          onChange={handleAuthorChange}
          placeholder="write here author content"
        />
      </div>
      <div>
        url:
        <input
          id="url"
          value={newUrl}
          onChange={handleUrlChange}
          placeholder="write here url content"
        />
      </div>
      <button id="create-button" type="submit">
        create
      </button>
    </form>
  )
}

export default BlogForm
