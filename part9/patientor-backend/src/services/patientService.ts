import patientData from '../../data/patients';
import { Patient, PublicPatient } from '../types';

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

const addPatient = () => {
  return null;
};

export default {
  getPublicPatients,
  addPatient,
};
