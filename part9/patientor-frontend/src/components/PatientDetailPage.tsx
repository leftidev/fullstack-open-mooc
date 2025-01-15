import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Divider,
  Box,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import axios from "axios";
import { apiBaseUrl } from "../constants";
import { Patient, Diagnosis, Entry } from "../types";

const PatientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        setPatient(response.data);
      } catch (error) {
        console.error("Error fetching patient details", error);
      }
    };

    if (id) {
      fetchPatient();
    }
  }, [id]);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        const response = await axios.get<Diagnosis[]>(
          `${apiBaseUrl}/diagnoses`
        );
        setDiagnoses(response.data);
      } catch (error) {
        console.error("Error fetching diagnoses", error);
      }
    };

    fetchDiagnoses();
  }, []);

  if (!patient) {
    return <Typography>Loading...</Typography>;
  }

  const getDiagnosisDescription = (code: string) => {
    const diagnosis = diagnoses.find((d) => d.code === code);
    return diagnosis ? diagnosis.name : "Unknown diagnosis";
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {patient.name}
      </Typography>
      <Divider />
      <Box marginTop={2}>
        <Typography variant="body1">
          Date of Birth: {patient.dateOfBirth}
        </Typography>
        <Typography variant="body1">SSN: {patient.ssn}</Typography>
        <Typography variant="body1">Gender: {patient.gender}</Typography>
        <Typography variant="body1">
          Occupation: {patient.occupation}
        </Typography>
      </Box>

      <Divider />

      <Typography variant="h6" gutterBottom>
        Entries
      </Typography>
      <List>
        {patient.entries.map((entry: Entry) => (
          <li key={entry.id} style={{ marginBottom: "1em" }}>
            <div>
              <strong>{entry.date}: </strong>
              {entry.description}
            </div>
            {entry.diagnosisCodes && (
              <ul style={{ margin: "0.5em 0 0 1.5em", padding: 0 }}>
                {entry.diagnosisCodes.map((code) => (
                  <li key={code}>
                    {code} {getDiagnosisDescription(code)}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </List>
    </Container>
  );
};

export default PatientDetailPage;
