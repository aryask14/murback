const express = require('express');
const jwt = require('jsonwebtoken');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

const router = express.Router();

// Auth middleware
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Book appointment
router.post('/', auth, async (req, res) => {
  try {
    const { doctorId, datetime } = req.body;
    if (!doctorId || !datetime) return res.status(400).json({ message: 'Missing fields' });
    // Check doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Prevent double-booking
    const exists = await Appointment.findOne({ doctor: doctorId, datetime: new Date(datetime) });
    if (exists) return res.status(400).json({ message: 'Doctor already booked at this time' });
    const appt = await Appointment.create({
      user: req.userId,
      userName: user.name,
      doctor: doctorId,
      doctorName: doctor.name,
      datetime,
    });
    res.status(201).json(appt);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// List user's appointments
router.get('/my', auth, async (req, res) => {
  try {
    const appts = await Appointment.find({ user: req.userId }).populate('doctor');
    res.json(appts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Cancel appointment
router.delete('/:id', auth, async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });
    if (appt.user.toString() !== req.userId) return res.status(403).json({ message: 'Not allowed' });
    appt.status = 'cancelled';
    await appt.save();
    res.json({ message: 'Cancelled', appt });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update appointment time
router.put('/:id', auth, async (req, res) => {
  try {
    const { datetime } = req.body;
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });
    if (appt.user.toString() !== req.userId) return res.status(403).json({ message: 'Not allowed' });
    // Prevent double-booking
    const exists = await Appointment.findOne({ doctor: appt.doctor, datetime: new Date(datetime), _id: { $ne: appt._id } });
    if (exists) return res.status(400).json({ message: 'Doctor already booked at this time' });
    appt.datetime = datetime;
    await appt.save();
    res.json(appt);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router; 