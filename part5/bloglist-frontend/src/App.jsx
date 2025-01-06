import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [blogtitle, setBlogTitle] = useState('')
  const [blogauthor, setBlogAuthor] = useState('')
  const [blogurl, setBlogUrl] = useState('')
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

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

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: blogtitle,
      author: blogauthor,
      url: blogurl
    }

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setBlogTitle('')
        setBlogAuthor('')
        setBlogUrl('')
      })

      setErrorMessage(`a new blog '${blogtitle}' by '${blogauthor}' added!`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
  }

  const handleBlogTitleChange = (event) => {
    console.log(event.target.value)
    setBlogTitle(event.target.value)
  }

  const handleBlogAuthorChange = (event) => {
    console.log(event.target.value)
    setBlogAuthor(event.target.value)
  }

  const handleBlogUrlChange = (event) => {
    console.log(event.target.value)
    setBlogUrl(event.target.value)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
      <h2>log in to application</h2>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
      <h2>create new</h2>
        title:
        <input
          type="text"
          value={blogtitle}
          name="title"
          onChange={handleBlogTitleChange}
        />
      </div>
      <div>
        author:
        <input
          type="text"
          value={blogauthor}
          name="author"
          onChange={handleBlogAuthorChange}
        />
      </div>
      <div>
        url:
        <input
          type="text"
          value={blogurl}
          name="url"
          onChange={handleBlogUrlChange}
        />
      </div>
      <button type="submit">create</button>
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
      <div>
        <h2>blogs</h2>
        <p>{user.name} logged-in</p>
        <button onClick={handleLogout}>logout</button>
        {blogForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      </div>
    }
    </div>
  )
}

export default App