export interface MultiplyValues {
  value1: number;
  value2: number;
}

export const parseArguments = (args: string[]): MultiplyValues => {
  if (args.length < 4) throw new Error("Not enough arguments");
  if (args.length > 4) throw new Error("Too many arguments");

  const value1 = Number(args[2]);
  const value2 = Number(args[3]);

  if (!isNaN(value1) && !isNaN(value2)) {
    return { value1, value2 };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

export const parseExerciseArguments = (
  args: string[]
): { target: number; exercises: number[] } => {
  if (args.length < 4) throw new Error("Not enough arguments");
  const target = Number(args[2]);
  const exercises = args.slice(3).map(Number);

  if (isNaN(target)) throw new Error("Target value is not a number!");
  if (exercises.some(isNaN))
    throw new Error("Some exercise hours are not valid numbers!");

  return { target, exercises };
};