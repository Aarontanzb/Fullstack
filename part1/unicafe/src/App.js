import { useState } from 'react'



const Statistics = ({ good, neutral, bad }) => {
  const sum = good + neutral + bad

  return(
    <> 
      <p>good {good}</p>
      <p>neutral {good}</p>
      <p>bad {good}</p>
      <p>all {sum}</p>
      <p>average {(good-bad)/(sum)}</p>
      <p>positive {String(good/(sum)) + ' %'}</p>
    </>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

  const increment = (state, setState) => () => setState(state + 1)

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={increment(good, setGood)} text='good' />
      <Button onClick={increment(neutral, setNeutral)} text='neutral' />
      <Button onClick={increment(bad, setBad)} text='bad' />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App