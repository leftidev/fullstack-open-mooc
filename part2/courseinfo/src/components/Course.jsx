const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ parts }) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0);
  return <p>total of {total} exercises</p>;
}

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => 
  <>
    {parts.map(part => 
      <Part key={part.id} part={part} />
    )}
  </>

const Course = ({ course }) => {
  return (
    <div>
      {course.map(course => (
        <div key={course.id}>
          <Header course={course.name} />
          <Content parts={course.parts} />
          <Total parts={course.parts} />
        </div>
      ))}
    </div>
  )
}

export default Course