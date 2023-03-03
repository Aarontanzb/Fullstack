export interface BmiValues {
  h: number;
  w: number;
}

export const parseArguments = (args: string[]): BmiValues => {
  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      h: Number(args[2]),
      w: Number(args[3])
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

export const calculateBmi = (h: number, w: number): string => {
  const bmi = w / (h / 100) ** 2;
  if (bmi < 18.5) {
    return 'Abnormal (under weight)';
  }
  if (bmi > 25) {
    return 'Abnormal (over weight)';
  } else {
    return 'Normal (healthy weight)';
  }
};

try {
  const { h, w } = parseArguments(process.argv);
  console.log(calculateBmi(h, w));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}
