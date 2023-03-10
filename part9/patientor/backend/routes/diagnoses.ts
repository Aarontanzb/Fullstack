import express from 'express';
import diagnosesService from '../services/diagnosesService';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(diagnosesService.getDiagnoses());
});

router.get('/:code', (req, res) => {
  const patient = diagnosesService.findById(req.params.code);

  if (patient) {
    res.send({ ...patient });
  } else {
    res.sendStatus(404);
  }
});

export default router;
