import { Entry } from '../../types';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WorkIcon from '@mui/icons-material/Work';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { Divider, List, ListItem } from '@mui/material';

const EntryDetails = ({ entry }: { entry: Entry }) => {
  switch (entry.type) {
    case 'Hospital': {
      return (
        <List component="nav" aria-label="entries">
          <ListItem>
            {entry ? entry.date : []} <LocalHospitalIcon />
          </ListItem>

          <ListItem>{entry ? entry.description : []}</ListItem>

          <ListItem>diagnose by {entry.specialist}</ListItem>
          <Divider />
        </List>
      );
    }
    case 'HealthCheck': {
      const colors = {
        0: 'red',
        1: 'yellow',
        2: 'lime',
        3: 'green'
      };
      return (
        <List component="nav" aria-label="entries">
          <ListItem>
            {entry ? entry.date : []} <MedicalServicesIcon />
          </ListItem>
          <ListItem>{entry ? entry.description : []}</ListItem>
          <ListItem style={{ color: colors[entry.healthCheckRating] }}>
            <FavoriteIcon />
          </ListItem>
          <ListItem>diagnose by {entry.specialist}</ListItem>
          <Divider />
        </List>
      );
    }
    case 'OccupationalHealthcare': {
      return (
        <List component="nav" aria-label="entries">
          <ListItem>
            {entry ? entry.date : []} <WorkIcon />
            {entry.employerName}
          </ListItem>
          <ListItem>{entry ? entry.description : []}</ListItem>
          <ListItem>diagnose by {entry.specialist}</ListItem>
          <Divider />
        </List>
      );
    }
    default:
      return <div>error</div>;
  }
};

export default EntryDetails;
