const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.createuser = async (req, res) => {
    try {
        const { name, email, password, role, specialization, key } = req.body;

        const check_user = await User.findOne({ email });
        if (check_user) {
            return res.status(400).json({ error: 'This email is already in use' });
        }
       if (role === 'admin') {
            if (!key || key != process.env.ADMIN_KEY) {
                return res.status(400).json({ error: 'Invalid or missing admin key' });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name, email, password: hashedPassword, role, specialization });
        await user.save();
        const { password: pw, ...userData } = user.toObject();
        res.status(201).json(userData);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getAllusers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.loginuser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } 
    );

    const { password: pw, ...userData } = user.toObject();
    res.status(200).json({ token, user: userData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteuser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getuserbyID = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('email role name');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getDoctors = async (req, res) => {
  try {
    const { specialization } = req.query;
    const filter = specialization
      ? { role: 'doctor', specialization }
      : { role: 'doctor' };

    const doctors = await User.find(filter, 'name specialization email');
    res.status(200).json(doctors);
  } catch (err) {
    console.error('Error fetching doctors:', err);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
};
