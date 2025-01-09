import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = () =>
  axios.get(baseUrl).then(res => res.data)

export const createAnecdote = newAnecdote => {
  console.log('Creating anecdote:', newAnecdote);
  return axios.post(baseUrl, newAnecdote)
    .then(res => res.data)
    .catch(error => {
      console.error('Error creating anecdote:', error.response.data);
      throw error;
    });
};

export const voteAnecdote = updatedAnecdote => {
  return axios.put(`${baseUrl}/${updatedAnecdote.id}`, updatedAnecdote)
    .then(res => res.data)
    .catch(error => {
      console.error('Error voting anecdote:', error.response.data);
      throw error;
    });
};