import PropTypes from 'prop-types'

const Blog = ({ blog, like, canRemove, remove }) => {
  return (
    <div>
      <h2>
        {blog.title} {blog.author}
      </h2>

      {
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
      }
    </div>
  )
}

Blog.propTypes = {
  like: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  canRemove: PropTypes.bool,
  blog: PropTypes.shape({
    title: PropTypes.string,
    author: PropTypes.string,
    url: PropTypes.string,
    likes: PropTypes.number
  })
}

export default Blog
