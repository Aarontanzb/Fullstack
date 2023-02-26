import axios from 'axios'
import storageService from './services/storage'
const baseUrl = '/api/blogs'

const headers = {
  Authorization: storageService.loadUser()
    ? `Bearer ${storageService.loadUser().token}`
    : null
}

export const getBlogs = () => axios.get(baseUrl).then((res) => res.data)

export const createBlog = async (newBlog) => {
  const res = await axios.post(baseUrl, newBlog.newBlog, { headers })
  return res.data
}

export const updateBlog = async (object) => {
  const request = await axios.put(`${baseUrl}/${object.id}`, object, {
    headers
  })
  return request.data
}

export const removeBlog = async (id) => {
  await axios.delete(`${baseUrl}/${id}`, { headers })
}
