interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface DescriptiveCoursePart extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends DescriptiveCoursePart  {
  kind: "basic"
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group"
}

interface CoursePartBackground extends DescriptiveCoursePart  {
  backgroundMaterial: string;
  kind: "background"
}

interface CoursePartSpecial extends DescriptiveCoursePart {
  requirements: string[];
  kind: "special";
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartSpecial;

interface HeaderProps {
  name: string;
}

interface ContentProps {
  courseParts: CoursePart[];
}

interface TotalProps {
  total: number;
}

const Header = (props: HeaderProps) => {
  return <h1>{props.name}</h1>;
};

const Part = (props: { part: CoursePart }) => {
  const { part } = props;

  switch (part.kind) {
    case "basic":
      return (
        <div>
          <h3>{part.name} {part.exerciseCount}</h3>
          <p><em>{part.description}</em></p>
        </div>
      );

    case "group":
      return (
        <div>
          <h3>{part.name} {part.exerciseCount}</h3>
          <p>Group Project Count: {part.groupProjectCount}</p>
        </div>
      );

    case "background":
      return (
        <div>
          <h3>{part.name} {part.exerciseCount}</h3>
          <p><em>{part.description}</em></p>
          <p>
            submit to:{" "}
            <a href={part.backgroundMaterial}>{part.backgroundMaterial}</a>
          </p>
        </div>
      );
      case "special":
        return (
          <div key={part.name}>
            <h3>{part.name} {part.exerciseCount}</h3>
            <p><em>{part.description}</em></p>
            <p>Requirements: {part.requirements.join(", ")}</p>
          </div>
        );

    default:
      return assertNever(part);
  }
};

const assertNever = (value: never): never => {
  throw new Error(`Unhandled case: ${JSON.stringify(value)}`);
};

const Content = (props: ContentProps) => {
  return (
    <div>
      {props.courseParts.map((part) => (
        <Part key={part.name} part={part} />
      ))}
    </div>
  );
};

const Total = (props: TotalProps) => {
  return <p>Number of exercises {props.total}</p>;
};

const App = () => {
  const courseName = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group"
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic"
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
      kind: "background"
    },
    {
      name: "TypeScript in frontend",
      exerciseCount: 10,
      description: "a hard part",
      kind: "basic",
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      kind: "special"
    }
  ];

  const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);

  return (
    <div>
      <Header name={courseName} />
      <Content courseParts={courseParts} />
      <Total total={totalExercises} />
    </div>
  );
};

export default App;