import { useState } from 'react'

const StatisticLine = ({ text, value }) => <tr><td>{text}</td><td>{value}</td></tr>

const Statistics = ({ good, neutral, bad }) => {
  const sum = good + neutral + bad

  if (sum === 0) {
    return (
      "No feedback given"
    )
  }

  return (
    <table>
      <tbody> 
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value ={neutral} />
        <StatisticLine text="bad" value ={bad} />
        <StatisticLine text="all" value ={sum} />
        <StatisticLine text="average" value ={(good-bad)/(sum)} />
        <StatisticLine text="positive" value ={String(good/(sum)*100) + ' %'} />
      </tbody>
      </table>
  )
}

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

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