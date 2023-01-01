import { useState } from 'react'

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>{text}</button>
)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Uint8Array(anecdotes.length))
 
  const copy = [...votes]

  const vote = () => {
    copy[selected] += 1
    setVotes(copy)
  }

  const randomize = () => setSelected(Math.floor(Math.random() * anecdotes.length))
  
  const maxIndex = copy.indexOf(Math.max.apply(null, copy))

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has votes {votes[selected]}</p>
      <Button onClick={vote} text='vote' />
      <Button onClick={randomize} text='next anecdote' />
      <h1>Anecdote with the most votes</h1>
      <p>{anecdotes[maxIndex]}</p>
      <p>has votes {votes[maxIndex]}</p>
    </div>
  )
}

export default App