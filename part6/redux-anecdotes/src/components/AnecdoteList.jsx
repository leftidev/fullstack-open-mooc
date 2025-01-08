import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote, sortAnecdotes } from '../reducers/anecdoteReducer';
import { showNotification } from '../reducers/notificationReducer';

const Anecdotes = () => {

  const dispatch = useDispatch()

  const anecdotes = useSelector(({ anecdotes, filter }) => {
    if (filter === '') {
      return anecdotes
    }
    return anecdotes.filter(anecdote =>
      anecdote.content.toLowerCase().includes(filter.toLowerCase())
    )
  })

  const handleVote = (anecdote) => {
    const updatedVotes = anecdote.votes + 1;
    dispatch(voteAnecdote(anecdote.id, updatedVotes, anecdote.content));
    dispatch(sortAnecdotes());
    dispatch(showNotification(`you voted '${anecdote.content}'`, 5000));
  };
  

  return (
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>
              vote
            </button>
          </div>
        </div>
      )}
    </div>)
}

export default Anecdotes