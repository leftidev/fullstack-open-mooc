import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import blogService from '../services/blogs'
import CommentForm from './CommentForm'

const BlogDetail = () => {
  const { id } = useParams();  // Get the blog id from the URL
  const queryClient = useQueryClient();

  const { data: blog, isLoading, isError } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogService.getById(id),
    retry: 1,
  });

  const addCommentMutation = useMutation({
    mutationFn: (comment) => blogService.addComment(id, comment),
    onSuccess: () => {
      // Invalidate and refetch the blog details after a new comment is added
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    }
  });

  if (isLoading) return <div>Loading blog details...</div>;
  if (isError) return <div>Failed to load blog details. Please try again.</div>;

  const addComment = async (content) => {
    addCommentMutation.mutate({ content });
  };

  return (
    <div>
      <h2>{blog.title} {blog.author}</h2>
      <p>
        <a href={blog.url}>
          {blog.url}
        </a>
      </p>
      <p>{blog.likes} likes</p>
      <p>added by {blog.user ? blog.user.name : 'Unknown user'}</p>
      <h3>Comments</h3>
      {blog.comments.length > 0 ? (
        <ul>
          {blog.comments.map((comment) => (
            <li key={comment.id}>{comment.content}</li>
          ))}
        </ul>
      ) : (
        <p>No comments yet.</p>
      )}
      <CommentForm blogId={id} addComment={addComment} />
    </div>
  )
}

export default BlogDetail
