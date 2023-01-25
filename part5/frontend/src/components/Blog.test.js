import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container

  beforeEach(() => {
    const mockHandler = jest.fn()
    const blog = {
      title: 'test',
      author: 'test2',
      url: 'test3',
      likes: 1,
      id: '6437y4b64w6b4',
      user: {
        username: 'aaron',
        id: '5643673546gdxg',
        name: 'aaron2'
      }
    }
    const user = {
      username: 'aaron'
    }
    container = render(
      <Blog
        key={blog.id}
        blog={blog}
        user={user}
        handleLike={mockHandler}
        handleDelete={mockHandler}
      />
    ).container
  })

  test('renders the blog', async () => {
    const div = container.querySelector('.blog')
    expect(div).toHaveTextContent('test')
  })

  test('at start url and likes are not displayed', async () => {
    const div = container.querySelector('.blog')
    expect(div).toBeVisible()

    const div2 = container.querySelector('.togglableContent')
    expect(div2).not.toBeVisible()
  })

  test('after clicking the button, url and likes are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div2 = container.querySelector('.togglableContent')
    expect(div2).toBeVisible()
  })

  test('clicking the button twice calls event handler twice', async () => {
    const blog2 = {
      title: 'test',
      author: 'test2',
      url: 'test3',
      likes: 1,
      id: '6437y4b64w6b4',
      user: {
        username: 'aaron',
        id: '5643673546gdxg',
        name: 'aaron2'
      }
    }

    const mockHandler = jest.fn()

    render(<Blog blog={blog2} handleLike={mockHandler} />)

    const user = userEvent.setup()
    const button = screen.getAllByText('like')[1]

    await user.click(button)
    await user.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
