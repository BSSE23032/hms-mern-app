const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength:20 },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  med_problem: { type: String, required: true },
  doctor: { type: String, required: true },
  date: { type: Date, default: Date.now },
  visited: { type: Boolean, default: false},
});

module.exports = mongoose.model('Patient', patientSchema);
