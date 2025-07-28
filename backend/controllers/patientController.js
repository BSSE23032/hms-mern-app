const Patient = require('../models/Patient');

// Create new patient
exports.createPatient = async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json(patient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all patients
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get patient by ID
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update patient
exports.updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(patient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete patient
exports.deletePatient = async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ message: 'Patient deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getPatientsByDoctor = async (req, res) => {
  try {
    const doctorName = req.params.doctor;
    
    const patients = await Patient.find({ doctor: doctorName });
    
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
exports.markAsVisited = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Patient.findByIdAndUpdate(
      id,
      { visited: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json({ message: 'Marked as visited', patient: updated });
  } catch (error) {
    console.error('Mark as visited error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
