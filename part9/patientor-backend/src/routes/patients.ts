import express from 'express';
import patientsData from '../../data/patients';

const router = express.Router();

interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: string; // Assuming gender is a string as mentioned
  occupation: string;
}

// Exclude `ssn` from the type for public use
type PublicPatient = Omit<Patient, 'ssn'>;


const patients: Patient[] = patientsData;

router.get('/', (_req, res) => {
  const publicPatients: PublicPatient[] = patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));

  res.json(publicPatients);
});

export default router;