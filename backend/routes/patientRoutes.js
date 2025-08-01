const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

router.post('/', patientController.createPatient);
router.get('/', patientController.getPaginatedPatients);
router.patch('/:id/mark-visited', patientController.markAsVisited);
router.get('/doctor/:doctor', patientController.getPatientsByDoctor);  
router.get('/:id', patientController.getPatientById);
router.put('/:id', patientController.updatePatient);
router.delete('/:id', patientController.deletePatient);
module.exports = router;
