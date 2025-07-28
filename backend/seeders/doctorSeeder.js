const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');
dotenv.config();
const specializations = [
  'Cardiologist',
  'Oncologist',
  'Gastroenterologist',
  'Dermatologist',
  'Eye Specialists',
  'Urologist',
  'Gynecologist',
  'Neurosurgeon'
];
const seedDoctors = async () => {
  try {
    const doctors = [];
    await connectDB();

    const hashedPassword = await bcrypt.hash('abc12345678', 10);
    
    for (let i = 1; i <= 200; i++) {
  const specialization = specializations[Math.floor(Math.random() * specializations.length)];
  doctors.push({
    name: `${faker.person.fullName().substring(0,20)}`,
    email: `doctor${i}@hospital.com`,
    password: hashedPassword,
    specialization,
    role: 'doctor'
  });
}
    await User.insertMany(doctors);
    console.log(' 200 doctors inserted successfully');

    process.exit();
  } catch (err) {
    console.error('Seeding Error:', err);
    process.exit(1);
  }
};

seedDoctors();
