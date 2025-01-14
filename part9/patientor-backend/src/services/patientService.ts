import patientData from '../../data/patients';
import { NonSensitivePatient, Patient, PublicPatient, NewPatient  } from '../types';
import { v1 as uuid } from 'uuid';

const patients: Patient[] = patientData;

const getPublicPatients = (): PublicPatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation, entries }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
    entries
  }));
};

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const findById = (id: string): Patient | undefined => {
  const entry = patients.find(d => d.id === id);
  return entry;
};

export const addPatient = (entry: NewPatient): Patient => {
  const newPatient: Patient = {
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    id: uuid(),
    ...entry,    ...entry,
  };

  patients.push(newPatient);
  return newPatient;
};

export default {
  getPublicPatients,
  addPatient,
  getNonSensitivePatients,
  findById
};
