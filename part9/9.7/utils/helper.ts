export const countNonZeros = (numbers: number[]): number => {
  let count = 0;
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] !== 0) {
      count++;
    }
  }
  return count;
};

export const calculateAverage = (numbers: number[]): number => {
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i];
  }
  return sum / numbers.length;
};

export const areAllNumbers = (numbers: number[]): boolean => {
  for (let i = 0; i < numbers.length; i++) {
    if (isNaN(numbers[i])) {
      return false;
    }
  }
  return true;
};

export default countNonZeros;
