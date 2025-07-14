const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, 
      family: 4 
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Failed', error);
    process.exit(1);
  }
};

module.exports = connectDB;