import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const inputTitle = screen.getByPlaceholderText('write here title content')
  const inputAuthor = screen.getByPlaceholderText('write here author content')
  const inputUrl = screen.getByPlaceholderText('write here url content')
  const sendButton = screen.getByText('create')

  await user.type(inputTitle, 'testTitle')
  await user.type(inputAuthor, 'testAuthor')
  await user.type(inputUrl, 'testUrl')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testTitle')
  expect(createBlog.mock.calls[0][0].author).toBe('testAuthor')
  expect(createBlog.mock.calls[0][0].url).toBe('testUrl')
})
