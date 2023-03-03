import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';
const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack');
});

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);
  if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
    // Return error message if input is invalid
    res.status(400).json({
      error: 'malformatted parameters'
    });
  } else {
    // Calculate BMI
    const bmi = calculateBmi(height, weight);

    // Return BMI as JSON
    res.json({
      weight: weight,
      height: height,
      bmi: bmi
    });
  }
});

app.post('/exercises', (req, res) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { daily_exercises, target } = req.body;
    if (!(daily_exercises && target)) {
      return res.status(400).json({
        error: 'parameters missing'
      });
    }
    if (!(daily_exercises instanceof Array) || typeof target !== 'number') {
      return res.status(400).json({
        error: 'malformatted parameters'
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const processedData: number[] = [target, ...daily_exercises];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = calculateExercises(processedData);
    console.log(result);
    return res.json(result);
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    return res.status(400).send('error: ' + error.message);
  }
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
