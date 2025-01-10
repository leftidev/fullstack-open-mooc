import { parseExerciseArguments } from "./utils";

interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

function calculateExercises(
  exercises: number[],
  target: number
): ExerciseResult {
  const periodLength = exercises.length;
  const trainingDays = exercises.filter((day) => day > 0).length;
  const average =
    exercises.reduce((sum, hours) => sum + hours, 0) / periodLength;

  const success = average >= target;

  let rating: number;
  let ratingDescription: string;

  if (average >= target) {
    rating = 3;
    ratingDescription = "this is better than expected, keep it up :)";
  } else if (average >= target * 0.5) {
    rating = 2;
    ratingDescription = "good, just as things should be";
  } else {
    rating = 1;
    ratingDescription =
      "this is bad, how can you look at yourself in the mirror? :(";
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
}

try {
  const { target, exercises } = parseExerciseArguments(process.argv);
  console.log(calculateExercises(exercises, target));
} catch (error: unknown) {
  let errorMessage = "Something bad happened.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
}