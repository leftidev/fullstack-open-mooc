import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  // Simulate user typing into the inputs
  const titleInput = screen.getByPlaceholderText('blogTitle')
  await user.type(titleInput, 'React Testing')

  const authorInput = screen.getByPlaceholderText('blogAuthor')
  await user.type(authorInput, 'jajuberg')

  const urlInput = screen.getByPlaceholderText('blogUrl')
  await user.type(urlInput, 'https://react-testing-library.com')

  // Simulate form submission
  const createButton = screen.getByText('create')
  await user.click(createButton)

  console.log(createBlog.mock.calls)

  expect(createBlog.mock.calls).toHaveLength(1)
  // Assert it was called with the correct data
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'React Testing',
    author: 'jajuberg',
    url: 'https://react-testing-library.com'
  })
})