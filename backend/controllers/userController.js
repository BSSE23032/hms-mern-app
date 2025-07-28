const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Create new User
const admin_key = 23032;

exports.createuser = async (req, res) => {
    try {
        const email = req.body.email;
        const check_user = await User.findOne({ email });
        if (check_user) {
            return res.status(400).json({ error: 'This email is already in use' });
        }

        if (req.body.role == 'admin') {
            if (!req.body.key) {
                return res.status(400).json({ error: 'Admin key is required' });
            }
            const key = req.body.key;
            if (key != admin_key) {
                return res.status(400).json({ error: 'Wrong admin key' });
            }
        }

        const { name, password, role, specialization } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            specialization
        });

        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all Users
exports.getAllusers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get User by ID
exports.loginuser = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            specialization: user.specialization
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update User
exports.updateuser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message }); a
    }
};

// Delete User
exports.deleteuser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// GET /api/users/:id
exports.getuserbyID = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('email role');
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({ role: user.role });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};
// GET /api/users/doctors?specialization=Cardiologist
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
