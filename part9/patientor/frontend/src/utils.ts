import axios from 'axios';

import {
  Gender,
  NewPatient,
  Diagnosis,
  EntryWithoutId,
  HealthCheckRating
} from './types';

export const getErrorMessage = (e: unknown) => {
  if (axios.isAxiosError(e)) {
    if (e?.response?.data && typeof e?.response?.data === 'string') {
      const message = e.response.data.replace(
        'Something went wrong. Error: ',
        ''
      );
      return message;
    } else {
      return 'Unrecognized axios error';
    }
  } else {
    return 'Unknown error';
  }
};

const toNewPatientEntry = (object: unknown): NewPatient => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if (!('name' in object)) throw new Error('name missing');
  if (!('occupation' in object)) throw new Error('occupation missing');
  if (!('ssn' in object)) throw new Error('ssn missing');
  if (!('gender' in object)) throw new Error('gender missing');
  if (!('dateOfBirth' in object)) throw new Error('dateOfBirth missing');

  return {
    name: parseName(object.name),
    occupation: parseOccupation(object.occupation),
    gender: parseGender(object.gender),
    ssn: parseSsn(object.ssn),
    dateOfBirth: parseDob(object.dateOfBirth),
    entries: []
  };
};

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isNumber = (value: unknown): value is number => {
  return typeof value === 'number';
};

const parseName = (name: unknown): string => {
  if (!isString(name)) {
    throw new Error('Incorrect or missing name');
  }

  return name;
};

const parseString = (value: unknown, what: string): string => {
  if (isString(value)) {
    return value;
  }
  throw new Error(`Value of ${what} incorrect: ${value}`);
};

const parseOccupation = (occupation: unknown): string => {
  if (!isString(occupation)) {
    throw new Error('Incorrect or missing occupation');
  }

  return occupation;
};

const parseSsn = (ssn: unknown): string => {
  if (!isString(ssn)) {
    throw new Error('Incorrect ssn');
  }

  return ssn;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDob = (dob: unknown): string => {
  if (!isString(dob) || !isDate(dob)) {
    throw new Error('Incorrect dob: ' + dob);
  }
  return dob;
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender)
    .map((v) => v.toString())
    .includes(param);
};

const parseGender = (value: unknown): Gender => {
  if (!isString(value) || !isGender(value)) {
    throw new Error(`Value of gender incorrect: ${value}`);
  }
  return value;
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> => {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    // we will just trust the data to be in correct form
    return [] as Array<Diagnosis['code']>;
  }

  return object.diagnosisCodes as Array<Diagnosis['code']>;
};

const parseHealthCheckRating = (value: unknown): HealthCheckRating => {
  if (
    isNumber(value) &&
    (value === 0 || value === 1 || value === 2 || value === 3)
  ) {
    return value;
  }
  throw new Error('Health Check Rating incorrect');
};

type SickLeaveType = {
  startDate: string;
  endDate: string;
};

const parseSickLeave = (object: unknown): SickLeaveType | undefined => {
  if (!object || typeof object !== 'object' || !('sickLeave' in object)) {
    return undefined;
  }

  const sickLeave = object.sickLeave;

  if (!sickLeave || typeof sickLeave !== 'object')
    throw new Error('invalid sickLeave');
  if (
    !('startDate' in sickLeave) ||
    !isString(sickLeave.startDate) ||
    !isDate(sickLeave.startDate)
  ) {
    throw new Error('sickLeave startDate missing or wrong type');
  }
  if (
    !('endDate' in sickLeave) ||
    !isString(sickLeave.endDate) ||
    !isDate(sickLeave.endDate)
  ) {
    throw new Error('sickLeave endDate missing or wrong type');
  }

  return {
    startDate: sickLeave.startDate,
    endDate: sickLeave.endDate
  };
};

type DischargeType = {
  date: string;
  criteria: string;
};

const parseDischarge = (object: unknown): DischargeType | undefined => {
  if (!object || typeof object !== 'object' || !('discharge' in object)) {
    return undefined;
  }

  const discharge = object.discharge;

  if (!discharge || typeof discharge !== 'object')
    throw new Error('invalid discharge');
  if (
    !('date' in discharge) ||
    !isString(discharge.date) ||
    !isDate(discharge.date)
  ) {
    throw new Error('discharge date missing or wrong type');
  }
  if (!('criteria' in discharge) || !isString(discharge.criteria)) {
    throw new Error('discharge criteria missing or wrong type');
  }

  return {
    date: discharge.date,
    criteria: discharge.criteria
  };
};

export const parseEntry = (object: unknown): EntryWithoutId => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if (!('description' in object)) throw new Error('description missing');
  if (!('date' in object)) throw new Error('date missing');
  if (!('specialist' in object)) throw new Error('specialist missing');
  if (!('type' in object)) throw new Error('type missing');

  const common = {
    description: parseString(object.description, 'description'),
    date: parseDob(object.date),
    specialist: parseString(object.specialist, 'specialist'),
    diagnosisCodes: parseDiagnosisCodes(object),
    type: parseString(object.type, 'type')
  };

  if (object.type === 'HealthCheck') {
    if (!('healthCheckRating' in object))
      throw new Error('healthCheckRating missing');
    return {
      ...common,
      type: 'HealthCheck',
      healthCheckRating: parseHealthCheckRating(object.healthCheckRating)
    };
  } else if (object.type === 'OccupationalHealthcare') {
    if (!('employerName' in object) || !('sickLeave' in object))
      throw new Error('employerName or sickLeave missing');
    return {
      ...common,
      type: 'OccupationalHealthcare',
      employerName: parseString(object.employerName, 'employerName'),
      sickLeave: parseSickLeave(object)
    };
  } else if (object.type === 'Hospital') {
    if (!('discharge' in object)) throw new Error('discharge missing');
    return {
      ...common,
      type: 'Hospital',
      discharge: parseDischarge(object)
    };
  }
  throw new Error(`Incorrect type: ${object.type}`);
};

export default toNewPatientEntry;
