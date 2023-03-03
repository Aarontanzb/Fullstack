import { countNonZeros, calculateAverage, areAllNumbers } from './utils/helper';

export interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export interface Training {
  daily_exercises: number[];
  target: number;
}

export const parseArguments = (args: string[]): number[] => {
  const converted = args.slice(2).map((str) => parseFloat(str));
  if (areAllNumbers(converted)) {
    return converted;
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

export const calculateExercises = (args: number[]): Result => {
  const training = args.slice(1);
  const trainingDays = countNonZeros(training);
  const periodLength = training.length;
  const target = args[0];
  const average = calculateAverage(training);
  let success = true;
  if (average < target) {
    success = false;
  }
  let rating = 3;
  let ratingDescription = 'very good';
  if (target - average > 1) {
    rating = 1;
    ratingDescription = 'poor';
  } else if (target - average < 1) {
    rating = 2;
    ratingDescription = 'not too bad but could be better';
  }

  return {
    periodLength: periodLength,
    trainingDays: trainingDays,
    success: success,
    rating: rating,
    ratingDescription: ratingDescription,
    target: target,
    average: average
  };
};

try {
  const values = parseArguments(process.argv);
  console.log(calculateExercises(values));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}
