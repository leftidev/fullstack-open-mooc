import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders blog title and author, but not URL or likes by default', () => {
  const blog = {
    title: 'React Testing',
    author: 'jajuberg',
    url: 'https://react-testing-library.com',
    likes: 5,
    user: { id: 1, name: 'Matti' }
  }

  render(<Blog blog={blog} user={blog.user} handleDelete={() => {}} handleLike={() => {}} />)

  expect(screen.getByText(/react testing/i)).toBeInTheDocument()
  expect(screen.getByText(/jajuberg/i)).toBeInTheDocument()

  expect(screen.queryByText('https://react-testing-library.com')).not.toBeInTheDocument()
  expect(screen.queryByText('5 likes')).not.toBeInTheDocument()
})

test('shows URL and likes when "view" button is clicked', async () => {
  const blog = {
    title: 'React Testing',
    author: 'jajuberg',
    url: 'https://react-testing-library.com',
    likes: 5,
    user: { id: 1, name: 'Matti' }
  }

  render(<Blog blog={blog} user={blog.user} handleDelete={() => {}} handleLike={() => {}} />)

  const user = userEvent.setup()

  // Check if URL and likes are not visible by default
  expect(screen.queryByText('https://react-testing-library.com')).not.toBeInTheDocument()
  expect(screen.queryByText('5 likes')).not.toBeInTheDocument()

  // Click the "view" button to toggle visibility
  const button = screen.getByText('view')
  await user.click(button)

  // Check if URL and likes are now visible
  expect(screen.getByText('https://react-testing-library.com')).toBeInTheDocument()
  expect(screen.getByText('5 likes')).toBeInTheDocument()
})

test('clicking the like button twice calls the event handler twice', async () => {
  const blog = {
    title: 'React Testing',
    author: 'jajuberg',
    url: 'https://react-testing-library.com',
    likes: 5,
    user: { id: 1, name: 'Matti' }
  }

  const mockHandler = vi.fn()  // Mock the event handler

  render(<Blog blog={blog} user={blog.user} handleDelete={() => {}} handleLike={mockHandler} />)

  const user = userEvent.setup()

  // Click the "view" button to show 'like' button
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  // Find the like button
  const likeButton = screen.getByText('like')

  // Simulate clicking the like button twice
  await user.click(likeButton)
  await user.click(likeButton)

  // Check that the event handler was called twice
  expect(mockHandler.mock.calls).toHaveLength(2)
})