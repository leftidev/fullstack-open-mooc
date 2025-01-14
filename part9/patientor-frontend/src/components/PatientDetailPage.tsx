import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Divider, Box } from "@mui/material";
import axios from "axios";
import { apiBaseUrl } from "../constants";
import { Patient } from "../types";

const PatientDetailPage = () => {
  const { id } = useParams<{ id: string }>(); // Extract patient id from the URL
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
        setPatient(response.data);
      } catch (error) {
        console.error("Error fetching patient details", error);
      }
    };

    if (id) {
      fetchPatient();
    }
  }, [id]);

  if (!patient) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {patient.name}
      </Typography>
      <Divider />
      <Box marginTop={2}>
        <Typography variant="body1">Date of Birth: {patient.dateOfBirth}</Typography>
        <Typography variant="body1">SSN: {patient.ssn}</Typography>
        <Typography variant="body1">Gender: {patient.gender}</Typography>
        <Typography variant="body1">Occupation: {patient.occupation}</Typography>
      </Box>
    </Container>
  );
};

export default PatientDetailPage;
