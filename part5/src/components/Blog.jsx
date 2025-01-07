import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, user, handleDelete }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = async () => {
    console.log('Blog object:', blog) // Add this line to debug
    console.log('Blog ID:', blog.id) // Add this line to debug
    const updatedBlog = {
      user: blog.user.id,
      likes: likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    try {
      await blogService.update(blog.id, updatedBlog)
      setLikes(likes + 1)
    } catch (error) {
      console.error('Error updating likes:', error)
    }
  }

  return (
    <div style={blogStyle}>
    <div>
      <div>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
        {user && blog.user && (
      <button onClick={() => handleDelete(blog.id)}>delete</button>
    )}
      </div>
      {visible && (
        <div>
          <p>{blog.url}</p>
          <p>{likes} likes <button onClick={handleLike}>like</button></p>
          <p>{blog.user ? blog.user.name : 'Unknown user'}</p>
        </div>
      )}
    </div>
    </div>
  )
}

export default Blog