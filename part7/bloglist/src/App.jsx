import { useRef, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import { useNotification } from './NotificationContext';
import Users from './components/Users';
import UserDetail from './components/UserDetail';

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, dispatch] = useNotification();

  const noteFormRef = useRef();
  const queryClient = useQueryClient();

  const { data: blogs = [], isLoading, isError } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    retry: 1,
  });

  const createBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      dispatch({
        type: 'SET_NOTIFICATION',
        payload: `A new blog '${newBlog.title}' by '${newBlog.author}' added!`,
      });
      setTimeout(() => dispatch({ type: 'CLEAR_NOTIFICATION' }), 5000);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error || error.response?.data || error.message;
      dispatch({
        type: 'SET_NOTIFICATION',
        payload: `Failed to create blog: ${errorMessage}`,
      });
      setTimeout(() => dispatch({ type: 'CLEAR_NOTIFICATION' }), 5000);
    }
  })

  const addBlog = (blogObject) => {
    noteFormRef.current.toggleVisibility();
    createBlogMutation.mutate(blogObject);
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      dispatch({ type: 'SET_NOTIFICATION', payload: 'Logged in successfully' });
      setTimeout(() => dispatch({ type: 'CLEAR_NOTIFICATION' }), 5000);
    } catch {
      dispatch({ type: 'SET_NOTIFICATION', payload: 'Wrong credentials' });
      setTimeout(() => dispatch({ type: 'CLEAR_NOTIFICATION' }), 5000);
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()

    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
    setUsername('')
    setPassword('')
    dispatch({ type: 'SET_NOTIFICATION', payload: 'Logged out successfully' });
    setTimeout(() => dispatch({ type: 'CLEAR_NOTIFICATION' }), 5000);
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      dispatch({
        type: 'SET_NOTIFICATION',
        payload: 'Blog deleted successfully',
      });
      setTimeout(() => dispatch({ type: 'CLEAR_NOTIFICATION' }), 5000);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error || error.response?.data || error.message;
      dispatch({
        type: 'SET_NOTIFICATION',
        payload: `Failed to delete blog: ${errorMessage}`,
      });
      setTimeout(() => dispatch({ type: 'CLEAR_NOTIFICATION' }), 5000);
    }
  })

  const likeBlogMutation = useMutation({
    mutationFn: ({ id, updatedBlog }) => blogService.update(id, updatedBlog),
    onSuccess: (updatedBlog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      dispatch({
        type: 'SET_NOTIFICATION',
        payload: `You liked '${updatedBlog.title}'!`,
      });
      setTimeout(() => dispatch({ type: 'CLEAR_NOTIFICATION' }), 5000);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error || error.response?.data || error.message;
      dispatch({
        type: 'SET_NOTIFICATION',
        payload: `Failed to like blog: ${errorMessage}`,
      });
      setTimeout(() => dispatch({ type: 'CLEAR_NOTIFICATION' }), 5000);
    }
  })

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      deleteBlogMutation.mutate(id);
    }
  }

  const handleLike = (id) => {
    const blogToUpdate = blogs.find((blog) => blog.id === id);
  
    if (blogToUpdate) {
      const updatedBlog = {
        ...blogToUpdate,
        likes: blogToUpdate.likes + 1,
      };
      if (typeof updatedBlog.user === 'object' && updatedBlog.user.id) {
        updatedBlog.user = updatedBlog.user.id;
      }
  
      likeBlogMutation.mutate({ id, updatedBlog });
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <h2>log in to application</h2>
        username
        <input
          type="text"
          data-testid="username"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          data-testid="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const Notification = () => {
    if (!notification) return null;
    return <div className="error">{notification}</div>;
  }

  if (isLoading) return <div>Loading blogs...</div>;
  if (isError) return <div>Failed to load blogs. Please try again.</div>;

  return (
    <Router>
      <div>
        <Notification />
        {user === null ? (
          loginForm()
        ) : (
          <div>
            <nav>
              <Link to="/blogs">Blogs</Link>
              {' | '}
              <Link to="/users">Users</Link>
              <h2>blogs</h2>
              <p>{user.name} logged-in</p>
              <button onClick={handleLogout}>logout</button>
            </nav>
            <Routes>
              <Route
                path="/blogs"
                element={
                  <div>
                    <Togglable buttonLabel="new note" ref={noteFormRef}>
                      <BlogForm createBlog={addBlog} />
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
              />
              <Route path="/users" element={<Users />} />
              <Route path="/users/:id" element={<UserDetail />} /> {/* Add route for individual user */}
            </Routes>
          </div>
        )}
      </div>
    </Router>
  )
}

export default App
