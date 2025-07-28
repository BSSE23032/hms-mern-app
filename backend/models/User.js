const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength:20 },
  key: { type: String},
  email: { type: String, required: true,unique:true },
  password: { type: String, required: true },
  role: { type: String,enum:["doctor","admin"], required: true },
  specialization: { type: String},
});

module.exports = mongoose.model('User', userSchema);
