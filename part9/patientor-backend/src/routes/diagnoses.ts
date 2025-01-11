import express from 'express';
import diagnosesData from '../../data/diagnoses';

const router = express.Router();

interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

const diagnoses: Diagnosis[] = diagnosesData;

router.get('/', (_req, res) => {
  res.json(diagnoses);
});

export default router;
