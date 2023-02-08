import { useSelector, useDispatch } from 'react-redux'
import Notification from './Notification'
import { upVote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(({ anecdotes, filter }) =>
    anecdotes.filter((anecdote) => anecdote.content.includes(filter))
  )
  const dispatch = useDispatch()

  return (
    <div>
      <Notification />
      {[...anecdotes]
        .sort((a, b) => b.votes - a.votes)
        .map((anecdote) => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button
                onClick={() => {
                  dispatch(upVote(anecdote))
                  dispatch(
                    setNotification(`you voted '${anecdote.content}'`, 10)
                  )
                }}
              >
                vote
              </button>
            </div>
          </div>
        ))}
    </div>
  )
}

export default AnecdoteList
