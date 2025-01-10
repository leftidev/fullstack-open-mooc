import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import blogService from '../services/blogs';
import { useNotification } from '../NotificationContext';

const BlogForm = () => {
  const [blogTitle, setBlogTitle] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('');
  const [blogUrl, setBlogUrl] = useState('');

  const queryClient = useQueryClient();
  const [, dispatch] = useNotification();

  const createBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      dispatch({
        type: 'SET_NOTIFICATION',
        payload: `Blog "${newBlog.title}" by "${newBlog.author}" created successfully!`,
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
    },
  });

  const addBlog = (event) => {
    event.preventDefault();
    createBlogMutation.mutate({
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl,
    });

    setBlogTitle('');
    setBlogAuthor('');
    setBlogUrl('');
  };

  return (
    <form onSubmit={addBlog}>
      <div>
        <h2>create new</h2>
        <label>
          title:
          <input
            type="text"
            value={blogTitle}
            name="title"
            onChange={(event) => setBlogTitle(event.target.value)}
            placeholder="blogTitle"
          />
        </label>
      </div>
      <div>
        <label>
          author:
          <input
            type="text"
            value={blogAuthor}
            name="author"
            onChange={(event) => setBlogAuthor(event.target.value)}
            placeholder="blogAuthor"
          />
        </label>
      </div>
      <div>
        <label>
          url:
          <input
            type="text"
            value={blogUrl}
            name="url"
            onChange={(event) => setBlogUrl(event.target.value)}
            placeholder="blogUrl"
          />
        </label>
      </div>
      <button type="submit">create</button>
    </form>
  );
};

export default BlogForm;
