const { countBy } = require('lodash')
const lodash = require('lodash')

const totalLikes = (blogs) => {
  return (highest = blogs.reduce((likes, blog) => likes + blog.likes, 0))
}

const favoriteBlog = (blogs) => {
  const highest = blogs.reduce((highest, blog) =>
    highest.likes > blog.likes ? highest : blog
  )

  const { title, author, likes } = highest

  return { title, author, likes }
}

const mostBlogs = (blogs) => {
  const result = lodash.countBy(blogs, 'author')
  const entries = Object.entries(result)
  const mostCommon = entries.sort((a, b) => b[1] - a[1])[0]
  return { author: mostCommon[0], blogs: mostCommon[1] }
}

const mostLikes = (blogs) => {
  const grouped = lodash.groupBy(blogs, 'author')
  const maxGroup = lodash.reduce(
    grouped,
    (result, value, key) => {
      const total = lodash.sumBy(value, 'likes')
      if (!result || total > result.likes) {
        return { author: key, likes: total }
      }
      return result
    },
    null
  )
  return maxGroup
}

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
