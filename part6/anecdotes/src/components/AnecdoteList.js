import { useSelector, useDispatch } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'
import { removeNotification, voteNotif } from '../reducers/notificationReducer'
import Notification from './Notification'

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
                  dispatch(vote(anecdote.id))
                  dispatch(voteNotif(anecdote.content))
                  setTimeout(() => {
                    dispatch(removeNotification())
                  }, 5000)
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
