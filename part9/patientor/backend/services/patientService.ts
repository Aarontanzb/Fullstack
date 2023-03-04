import patientData from '../data/patients';

import { Patient, NonSensitivePatient } from '../../frontend/src/types';

const patients: Patient[] = patientData;

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patientData.map(({ id, name, occupation, gender, dateOfBirth }) => ({
    id,
    name,
    occupation,
    gender,
    dateOfBirth
  }));
};

export default {
  patients,
  getNonSensitivePatients
};
