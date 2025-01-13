import patientData from '../../data/patients';
import { Patient, PublicPatient, NewPatient  } from '../types';
import { v1 as uuid } from 'uuid';

const patients: Patient[] = patientData as Patient[];

const getPublicPatients = (): PublicPatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
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
  addPatient
};
