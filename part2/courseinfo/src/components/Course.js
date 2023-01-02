const Header = ({ course }) => <h2>{course}</h2>

const Total = ({ parts }) => 
  <p>
    <strong>
      total of {parts.reduce((total, value) => total + value.exercises, 0)} exercises
    </strong>
  </p>

const Part = ({ part }) =>
  <p>
    {part.name} {part.exercises} 
  </p>

const Content = ({ parts }) =>
  <>
    {parts.map(part => <Part key={part.id} part={part} />)}
  </>

let arrayId = 10

const Course = ({ courses }) => 
  <>
    <h1>Web development curriculum</h1>
    {courses.map(course => 
        <div key={arrayId++}>
            <Header course={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </div>
    )}
  </>

export default Course