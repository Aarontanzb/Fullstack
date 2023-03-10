import patientData from '../data/patients';

import {
  Patient,
  NonSensitivePatient,
  PatientFormValues,
  Entry,
  EntryWithoutId
} from '../../frontend/src/types';

import { v1 as uuid } from 'uuid';

const patients: Patient[] = patientData;

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map((patient) => ({
    ...patient
  }));
};

const addPatient = (entry: PatientFormValues): Patient => {
  const newPatientEntry = {
    ...entry,
    id: uuid(),
    entries: []
  };

  patients.push(newPatientEntry);
  return newPatientEntry;
};

const findById = (id: string): Patient | undefined => {
  const entry = patients.find((d) => d.id === id);
  return entry;
};

const addEntry = (entry: EntryWithoutId, id: string): Patient | undefined => {
  const patient = patients.find((p) => p.id === id);

  if (patient) {
    const newEntry: Entry = {
      ...entry,
      id: uuid()
    };
    patient.entries.push(newEntry);
  }
  return patient;
};

export default {
  patients,
  getNonSensitivePatients,
  addPatient,
  findById,
  addEntry
};
