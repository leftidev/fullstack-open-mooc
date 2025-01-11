import express from 'express';

const router = express.Router();
/*
interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  occupation: string;
  ssn: string; // NOT OT BE INCLUDED IN THE RESPONSE for GET /api/patients
}
*/

// Mock test data for /api/patients
const patients = [
  { id: '1', name: 'John Doe', gender: 'male', occupation: 'Software Developer' },
  { id: '2', name: 'Jane Doe', gender: 'female', occupation: 'Data Scientist' },
];

router.get('/', (_req, res) => {
  res.json(patients);
});

router.post('/', (_req, res) => {
  res.send('Saving a diary!');
});

export default router;