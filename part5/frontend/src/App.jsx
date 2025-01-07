import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const noteFormRef = useRef()

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    
    try {
      window.localStorage.removeItem('loggedNoteappUser')
      setUser(null)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Logout failed')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = (blogObject) => {
    noteFormRef.current.toggleVisibility()
    blogService
    .create(blogObject)
    .then(returnedBlog => {
      const blogWithUser = { ...returnedBlog, user};
      setBlogs(blogs.concat(blogWithUser))
      setErrorMessage(`a new blog '${returnedBlog.title}' by '${returnedBlog.author}' added!`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    })
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      blogService
        .remove(id)
        .then(() => {
          setBlogs(blogs.filter(blog => blog.id !== id))
          setErrorMessage('Blog deleted successfully')
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
        .catch(error => {
          setErrorMessage('Failed to delete blog')
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  const handleLike = (id) => {
    const blogToUpdate = blogs.find((blog) => blog.id === id);
  
    if (blogToUpdate) {
      const updatedBlog = {
        ...blogToUpdate,
        likes: blogToUpdate.likes + 1,
        user: blogToUpdate.user.id, // Ensure `user` is structured properly for the backend
      };
  
      blogService
        .update(id, updatedBlog)
        .then((returnedBlog) => {
          setBlogs(
            blogs.map((blog) =>
              blog.id === id ? { ...blog, likes: returnedBlog.likes } : blog
            )
          );
          setErrorMessage(`You liked '${returnedBlog.title}'!`);
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        })
        .catch((error) => {
          console.error('Error updating likes:', error);
          setErrorMessage('Failed to update likes');
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        });
    }
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
      <h2>log in to application</h2>
        username
          <input
          type="text"
          data-testid='username'
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          data-testid='password'
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )


  const Notification = ({ message }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div className='error'>
        {message}
      </div>
    )
  }

  return (
    <div>
    <Notification message={errorMessage} />
      {user === null ?
      loginForm() :
      <div  data-testid="blog-item">
        <h2>blogs</h2>
        <p>{user.name} logged-in</p>
        <button onClick={handleLogout}>logout</button>
        <Togglable buttonLabel='new note' ref={noteFormRef}>
       <BlogForm
          createBlog={addBlog}
        />
      </Togglable>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            user={user}
            handleDelete={handleDelete}
            handleLike={handleLike}
          />
        ))}
      </div>
    }
    </div>
  )
}

export default App