const App = () => {
  const courseName = 'Half Stack application development';
  interface CoursePartBase {
    name: string;
    exerciseCount: number;
  }

  interface CoursePartBases extends CoursePartBase {
    description: string;
  }

  interface CoursePartGroup extends CoursePartBase {
    groupProjectCount: number;
    kind: 'group';
  }

  interface CoursePartBasic extends CoursePartBases {
    kind: 'basic';
  }

  interface CoursePartBackground extends CoursePartBases {
    backgroundMaterial: string;
    kind: 'background';
  }

  interface CoursePartSpecial extends CoursePartBases {
    requirements: string[];
    kind: 'special';
  }

  type CoursePart =
    | CoursePartBasic
    | CoursePartGroup
    | CoursePartBackground
    | CoursePartSpecial;

  const courseParts: CoursePart[] = [
    {
      name: 'Fundamentals',
      exerciseCount: 10,
      description: 'This is an awesome course part',
      kind: 'basic'
    },
    {
      name: 'Using props to pass data',
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: 'group'
    },
    {
      name: 'Basics of type Narrowing',
      exerciseCount: 7,
      description: 'How to go from unknown to string',
      kind: 'basic'
    },
    {
      name: 'Deeper type usage',
      exerciseCount: 14,
      description: 'Confusing description',
      backgroundMaterial:
        'https://type-level-typescript.com/template-literal-types',
      kind: 'background'
    },
    {
      name: 'TypeScript in frontend',
      exerciseCount: 10,
      description: 'a hard part',
      kind: 'basic'
    },
    {
      name: 'Backend development',
      exerciseCount: 21,
      description: 'Typing the backend',
      requirements: ['nodejs', 'jest'],
      kind: 'special'
    }
  ];

  const Part = ({ part }: { part: CoursePart }) => {
    const assertNever = (value: never): never => {
      throw new Error(
        `Unhandled discriminated union member: ${JSON.stringify(value)}`
      );
    };
    let details = null;
    switch (part.kind) {
      case 'basic':
        details = <i>{part.description}</i>;
        break;
      case 'background':
        details = (
          <>
            <i>{part.description}</i>
            <p>submit to {part.backgroundMaterial}</p>
          </>
        );
        break;
      case 'group':
        details = <p>project exercises {part.groupProjectCount}</p>;
        break;
      case 'special':
        details = (
          <>
            <i>{part.description}</i>;
            <p>required skills: {part.requirements.join(', ')}</p>
          </>
        );
        break;
      default:
        return assertNever(part);
    }
    return (
      <div>
        <h4>
          {part.name} {part.exerciseCount}
        </h4>
        <>{details}</>
      </div>
    );
  };

  const Header = ({ text }: { text: string }) => {
    return <h1>{text}</h1>;
  };

  const Content = ({ parts }: { parts: CoursePart[] }) => {
    return (
      <div>
        {parts.map((part) => (
          <Part key={part.name} part={part} />
        ))}
      </div>
    );
  };

  const Total = ({ total }: { total: CoursePartBase[] }) => {
    return (
      <p>
        Number of exercises{' '}
        {total.reduce((carry, part) => carry + part.exerciseCount, 0)}
      </p>
    );
  };

  return (
    <div>
      <Header text={courseName} />
      <Content parts={courseParts} />
      <Total total={courseParts} />
    </div>
  );
};

export default App;
