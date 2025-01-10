import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import blogService from '../services/blogs';  // Assuming blogService is where you define the API call

const CommentForm = ({ blogId }) => {
  const [comment, setComment] = useState('');

  const mutation = useMutation({
    mutationFn: (newComment) => blogService.addComment(blogId, newComment), // API call to add comment
    onSuccess: () => {
      setComment(''); // Reset comment input after successful submission
    },
    onError: (error) => {
      console.error('Error adding comment:', error);
    },
  });

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    if (comment.trim()) {
      mutation.mutate(comment);  // Trigger the mutation to add comment
    }
  };

  return (
    <form onSubmit={handleCommentSubmit}>
      <div>
        <input
          type="text"
          value={comment}
          onChange={handleCommentChange}
          placeholder="Add a comment"
        />
        <button type="submit" disabled={mutation.isLoading}>Add Comment</button>
      </div>
      {mutation.isError && (
        <div className="error">
          Something went wrong. Please try again later.
        </div>
      )}
      {mutation.isLoading && (
        <div>Loading...</div>
      )}
    </form>
  );
};

export default CommentForm;
