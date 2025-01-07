import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
    const [blogtitle, setBlogTitle] = useState('')
    const [blogauthor, setBlogAuthor] = useState('')
    const [blogurl, setBlogUrl] = useState('')
  
    const addBlog = (event) => {
        event.preventDefault()
        createBlog({
          title: blogtitle,
          author: blogauthor,
          url: blogurl
        })

        setBlogTitle('')
        setBlogAuthor('')
        setBlogUrl('')
    }
  
    return (
        <form onSubmit={addBlog}>
          <div>
          <h2>create new</h2>
            title:
            <input
              type="text"
              value={blogtitle}
              name="title"
              onChange={event => setBlogTitle(event.target.value)}
            />
          </div>
          <div>
            author:
            <input
              type="text"
              value={blogauthor}
              name="author"
              onChange={event => setBlogAuthor(event.target.value)}
            />
          </div>
          <div>
            url:
            <input
              type="text"
              value={blogurl}
              name="url"
              onChange={event => setBlogUrl(event.target.value)}
            />
          </div>
          <button type="submit">create</button>
        </form>  
      )
  }
  
  export default BlogForm