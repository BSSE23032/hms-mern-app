const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const patientRoutes = require('./routes/patientRoutes');
const cors = require('cors');
const path = require('path');

dotenv.config();
connectDB();

// Enhanced CORS configuration
app.use(cors({
  origin: 'https://deploy-mern-1whq.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

app.use('/api/patients', patientRoutes);

module.exports = app;