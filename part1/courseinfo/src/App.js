const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  const Header = (props) => {
    return <h1>{props.course.name}</h1>
  }

  const Part = (props) => { 
    const { name, exercises } = props.part
    return <p>{name} {exercises}</p>
  }

  const Content = (props) => {
    return (
      <div>
        <Part part={props.course.parts[0]} />
        <Part part={props.course.parts[1]} />
        <Part part={props.course.parts[2]} />
      </div>
    )
  }

  const Total = (props) => {
    return (
      <p>Total number of exercises {props.course.parts.reduce((total, part) => total + part.exercises, 0)}</p>
    )
  }

  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  )
}

export default App