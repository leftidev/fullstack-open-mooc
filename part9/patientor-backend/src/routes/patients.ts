import express from "express";
import patientService from "../services/patientService";
import toNewPatient from '../utils';
import { Entry } from '../types';

const router = express.Router();

router.get("/", (_req, res) => {
  res.json(patientService.getPublicPatients());
});

const isValidEntryType = (entry: unknown): entry is Entry => {
  const validTypes: string[] = ['HealthCheck', 'OccupationalHealthcare', 'Hospital'];
  return typeof entry === 'object' && entry !== null && 'type' in entry && validTypes.includes((entry as Entry).type);
};

router.get('/:id', (req, res) => {
  const patient = patientService.findById(req.params.id);

  if (patient) {
    const invalidEntries = patient.entries.filter(entry => !isValidEntryType(entry));

    if (invalidEntries.length > 0) {
      res.status(400).send({
        error: `Invalid entry type found for patient ${patient.id}.`,
        invalidEntries,
      });
    }

    res.send(patient);
  } else {
    res.sendStatus(404);
  }
});

router.post('/', (req, res) => {
  try {
    const newPatient = toNewPatient(req.body);
    const addedPatient = patientService.addPatient(newPatient);
    res.json(addedPatient);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;
