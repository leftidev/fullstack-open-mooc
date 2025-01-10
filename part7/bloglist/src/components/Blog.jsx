import { useState } from 'react'
import { Link } from 'react-router-dom'

const Blog = ({ blog, user, handleDelete, handleLike }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div style={blogStyle}>
    <div>
      <div>
        <Link to={`/blogs/${blog.id}`}>
            {blog.title} {blog.author}
        </Link> 
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
        {user && blog.user && user.id === blog.user.id && (
          <button onClick={() => handleDelete(blog.id)}>delete</button>
        )}
      </div>
      {visible && (
        <div>
          <p>{blog.url}</p>
          <p>
          <span data-testid="likes">
            {blog.likes}</span> likes{' '}
            <button onClick={() => handleLike(blog.id)}>like</button>
          </p>
          <p>{blog.user ? blog.user.name : 'Unknown user'}</p>
        </div>
      )}
    </div>
    </div>
  )
}

export default Blog