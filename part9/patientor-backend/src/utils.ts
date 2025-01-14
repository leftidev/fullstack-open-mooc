import { NewPatient, Gender, Entry } from './types';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parseName = (name: unknown): string => {
  if (!isString(name)) {
    throw new Error('Incorrect or missing name');
  }
  return name;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDateOfBirth = (date: unknown): string => {
  if (!isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date of birth');
  }
  return date;
};

const parseSSN = (ssn: unknown): string => {
  if (!isString(ssn)) {
    throw new Error('Incorrect or missing SSN');
  }
  return ssn;
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender).includes(param as Gender);
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
    throw new Error('Incorrect or missing gender');
  }
  return gender;
};

const parseOccupation = (occupation: unknown): string => {
  if (!isString(occupation)) {
    throw new Error('Incorrect or missing occupation');
  }
  return occupation;
};

const isEntry = (entry: unknown): entry is Entry => {
  return typeof entry === 'object' && entry !== null;
};

const parseEntries = (entries: unknown): Entry[] => {
  if (!entries) {
    return [];
  }

  if (!Array.isArray(entries) || !entries.every(isEntry)) {
    throw new Error('Incorrect or missing entries');
  }
  return entries;
};

const toNewPatient = (object: unknown): NewPatient => {
  console.log("Input object:", object);

  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if (
    'name' in object &&
    'dateOfBirth' in object &&
    'ssn' in object &&
    'gender' in object &&
    'occupation' in object
  ) {
    const newPatient: NewPatient = {
      name: parseName(object.name),
      dateOfBirth: parseDateOfBirth(object.dateOfBirth),
      ssn: parseSSN(object.ssn),
      gender: parseGender(object.gender),
      occupation: parseOccupation(object.occupation),
      entries: parseEntries((object as { entries?: unknown }).entries), // Handle missing entries gracefully
    };

    return newPatient;
  }

  throw new Error('Incorrect data: a field is missing');
};

export default toNewPatient;
