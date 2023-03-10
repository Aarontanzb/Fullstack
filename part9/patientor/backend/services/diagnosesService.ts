import diagnosesData from '../data/diagnoses';

import { Diagnosis } from '../../frontend/src/types';

const diagnoses: Diagnosis[] = diagnosesData;

const getDiagnoses = (): Diagnosis[] => {
  return diagnoses;
};

const findById = (code: string): Diagnosis | undefined => {
  const entry = diagnoses.find((d) => d.code === code);
  return entry;
};

export default {
  getDiagnoses,
  findById
};
