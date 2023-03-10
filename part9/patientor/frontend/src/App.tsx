import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  // eslint-disable-next-line
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  useMatch
} from 'react-router-dom';
import { Button, Divider, Container, Typography } from '@mui/material';

import { apiBaseUrl } from './constants';
import { Diagnosis, Patient } from './types';

import patientService from './services/patients';
import diagnosesService from './services/diagnoses';

import PatientListPage from './components/PatientListPage';
import PatientPage from './components/PatientPage';

const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      const patients = await patientService.getAll();
      setPatients(patients);
    };
    void fetchPatientList();

    const fetchDiagnosesList = async () => {
      const diagnoses = await diagnosesService.getAll();
      setDiagnoses(diagnoses);
    };
    void fetchDiagnosesList();
  }, []);

  const match = useMatch('/:id');
  const patient = match
    ? patients.find((patient) => patient.id === match.params.id)
    : null;

  //find diagnosis here to match with patient entries

  return (
    <div className="App">
      <Container>
        <Typography variant="h3" style={{ marginBottom: '0.5em' }}>
          Patientor
        </Typography>
        <Button component={Link} to="/" variant="contained" color="primary">
          Home
        </Button>
        <Divider hidden />
        <Routes>
          <Route
            path="/"
            element={
              <PatientListPage patients={patients} setPatients={setPatients} />
            }
          />
          <Route
            path="/:id"
            element={
              patient ? (
                // add diagnosis={diagnosis}
                <PatientPage patient={patient} diagnoses={diagnoses} />
              ) : (
                <div>Patient not found</div>
              )
            }
          />
        </Routes>
      </Container>
    </div>
  );
};

export default App;
