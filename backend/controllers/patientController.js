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
exports.getPaginatedPatients = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
     const search = req.query.search || "";

    const filter = search
      ? { name: { $regex: search, $options: "i" } }
      : {};

    const skip = (page - 1) * limit;
    const tot_patients = await Patient.countDocuments(filter);
    const tot_pages = Math.ceil(tot_patients / limit);

    const patients = await Patient.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ date: -1 });

    res.status(200).json({
      patients,
      tot_patients,
      tot_pages,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching paginated patients' });
  }
};

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
    const doc_name = req.params.doctor;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
     const skip = (page - 1) * limit;
    const search = req.query.search || "";

    // Combine doctor name and optional search filter
    const filter = {
      doctor: doc_name,
      ...(search && { name: { $regex: search, $options: "i" } })
    };

    // Count total documents with combined filter
    const tot_patients = await Patient.countDocuments(filter);
    const tot_pages = Math.ceil(tot_patients / limit);
    const curr_page=page;
    // Find and paginate
    const patients = await Patient.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ date: -1 });

    res.status(200).json({
      patients,
      tot_patients,
      tot_pages,
      curr_page,
    });
  } catch (error) {
    console.error("Doctor filter pagination error:", error);
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
