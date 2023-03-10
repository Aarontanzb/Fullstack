import { Patient, Gender, Diagnosis, EntryWithoutId } from '../../types';
import { Male, Female, QuestionMark } from '@mui/icons-material';
import EntryDetails from './EntryDetails';
import AddEntryForm from './AddEntryForm';
import { useState } from 'react';
import { Alert } from '@mui/material';
import { getErrorMessage } from '../../utils';
import patientService from '../../services/patients';

const PatientPage = ({
  patient,
  diagnoses
}: {
  patient: Patient;
  diagnoses: Diagnosis[];
}) => {
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getGenderIcon = (gender: Gender) => {
    if (gender === Gender.Male) {
      return <Male />;
    }

    if (gender === Gender.Female) {
      return <Female />;
    }

    return <QuestionMark />;
  };

  interface DiagnosesProps {
    diagnosisCodes?: string[];
  }

  const Diagnoses: React.FC<DiagnosesProps> = ({ diagnosisCodes }) => {
    const matchingDiagnoses = diagnosisCodes
      ? diagnosisCodes.map((code) => {
          const diagnosis = diagnoses.find((d) => d.code === code);
          return diagnosis ? `${code} ${diagnosis.name}` : code;
        })
      : [];

    return (
      <ul>
        {matchingDiagnoses.map((diagnosis) => (
          <li key={diagnosis}>{diagnosis}</li>
        ))}
      </ul>
    );
  };

  const closeForm = () => {
    setVisible(false);
    setError(null);
  };

  const submitHandler = async (
    values: EntryWithoutId,
    resetter: () => void
  ) => {
    if (!patient) return null;
    try {
      await patientService.createEntry(values, patient.id);
      setVisible(false);
      setError(null);
      resetter();
    } catch (e: unknown) {
      const message = getErrorMessage(e);
      setError(message);
    }
  };
  return (
    <>
      <div>
        <h3>
          {patient.name} {getGenderIcon(patient.gender)}
        </h3>
      </div>
      <div>ssn: {patient.ssn}</div>
      <div>occupation: {patient.occupation}</div>

      {error && <Alert severity="error">{error}</Alert>}

      <h4>entries</h4>
      <div>
        {patient.entries.map((entry) => (
          <EntryDetails entry={entry} key={entry.id} />
        ))}
      </div>
      <div>
        <Diagnoses
          diagnosisCodes={
            patient.entries[0] ? patient.entries[0].diagnosisCodes : []
          }
        />
      </div>
      <AddEntryForm
        onOpen={() => setVisible(true)}
        onCancel={closeForm}
        visible={visible}
        onSubmit={submitHandler}
        diagnoses={diagnoses}
      />
    </>
  );
};

export default PatientPage;
