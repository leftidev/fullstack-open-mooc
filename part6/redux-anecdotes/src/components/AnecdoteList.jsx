import { useDispatch, useSelector } from 'react-redux'
import { vote, sortAnecdotes } from '../reducers/anecdoteReducer'
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

  return (
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => {
              dispatch(vote(anecdote.id));
              dispatch(sortAnecdotes());
              dispatch(showNotification(`you voted '${anecdote.content}'`, 5000));
              }}>
              
                vote
            </button>
          </div>
        </div>
      )}
    </div>)
}

export default Anecdotes