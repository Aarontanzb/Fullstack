import Togglable from './Togglable'

const Blog = ({ blog, user, handleLike, handleDelete }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle} className="blog">
      {blog.title} {blog.author}
      <Togglable buttonLabel="view">
        <div className="togglableContent">
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}
            <button onClick={handleLike}>like</button>
          </div>
        </div>
        <div> {blog.user.name}</div>
        {user?.username !== null ? (
          blog.user?.username === user?.username ? (
            <button onClick={handleDelete}>remove</button>
          ) : (
            ''
          )
        ) : (
          ''
        )}
      </Togglable>
    </div>
  )
}

export default Blog
