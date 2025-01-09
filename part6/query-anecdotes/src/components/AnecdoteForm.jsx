import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import { useNotification } from '../NotificationContext';

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const [, dispatch] = useNotification();

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] });
      dispatch({
        type: 'SET_NOTIFICATION',
        payload: `Anecdote "${data.content}" created successfully!`,
      });
      setTimeout(() => dispatch({ type: 'CLEAR_NOTIFICATION' }), 5000);
    },
    onError: (error) => {
      const errorMessage =
      error.response?.data?.error || error.response?.data || error.message; // parse error message from server response
      dispatch({
        type: 'SET_NOTIFICATION',
        payload: `Failed to create anecdote: ${errorMessage}`,
      });
      setTimeout(() => dispatch({ type: 'CLEAR_NOTIFICATION' }), 5000);
    },
  });

  const onCreate = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })
    console.log(content)
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
