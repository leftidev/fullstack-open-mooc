import express from 'express';

import { calculateBmi } from "./bmiCalculator";
import { calculateExercises } from "./exerciseCalculator";

const app = express();
const PORT = 3003;

app.use(express.json())

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi/', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (isNaN(height) || isNaN(weight)) {
    res.status(400).json({ error: "malformatted parameters" });
  }

  const bmi = calculateBmi(height, weight);
  res.json({
    weight,
    height,
    bmi
  });
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  if (!daily_exercises || !target) {
    res.status(400).json({ error: "parameters missing" });
  }

  if (isNaN(Number(target)) || !Array.isArray(daily_exercises)) {
    res.status(400).json({ error: "malformatted parameters" });
  }
  
   // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const result = calculateExercises(daily_exercises, target);
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});