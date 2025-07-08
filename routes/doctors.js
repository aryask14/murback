const express = require('express');
const Doctor = require('../models/Doctor');

const router = express.Router();

// List all doctors
router.get('/', async (req, res) => {
  try {
    const { specialty } = req.query;
    const filter = specialty ? { specialty } : {};
    const doctors = await Doctor.find(filter);
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get a single doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// (DEV ONLY) Seed doctors
router.post('/seed', async (req, res) => {
  try {
    const sample = [
      {
        name: "Dr. Sarah Johnson",
        specialty: "Cardiology",
        hospital: "City Heart Center",
        rating: 4.8,
        reviews: 124,
        image: "https://randomuser.me/api/portraits/women/44.jpg"
      },
      {
        name: "Dr. Michael Chen",
        specialty: "Neurology",
        hospital: "Neurocare Institute",
        rating: 4.7,
        reviews: 89,
        image: "https://randomuser.me/api/portraits/men/32.jpg"
      },
      {
        name: "Dr. Emily Rodriguez",
        specialty: "Pediatrics",
        hospital: "Children's Wellness Center",
        rating: 4.9,
        reviews: 156,
        image: "https://randomuser.me/api/portraits/women/65.jpg"
      },
      {
        name: "Dr. James Wilson",
        specialty: "Orthopedics",
        hospital: "Bone & Joint Center",
        rating: 4.6,
        reviews: 210,
        image: "https://randomuser.me/api/portraits/men/41.jpg"
      },
      {
        name: "Dr. Lisa Park",
        specialty: "Dermatology",
        hospital: "Skin Health Clinic",
        rating: 4.8,
        reviews: 98,
        image: "https://randomuser.me/api/portraits/women/68.jpg"
      },
      {
        name: "Dr. Robert Thompson",
        specialty: "Ophthalmology",
        hospital: "Vision Plus",
        rating: 4.7,
        reviews: 77,
        image: "https://randomuser.me/api/portraits/men/55.jpg"
      },
      {
        name: "Dr. Angela Martinez",
        specialty: "Gynecology",
        hospital: "Women's Health Center",
        rating: 4.9,
        reviews: 134,
        image: "https://randomuser.me/api/portraits/women/72.jpg"
      },
      {
        name: "Dr. David Kim",
        specialty: "Dentistry",
        hospital: "Smile Dental Care",
        rating: 4.8,
        reviews: 102,
        image: "https://randomuser.me/api/portraits/men/23.jpg"
      },
      {
        name: "Dr. Priya Singh",
        specialty: "Psychiatry",
        hospital: "Mind Matters Clinic",
        rating: 4.7,
        reviews: 88,
        image: "https://randomuser.me/api/portraits/women/12.jpg"
      },
      {
        name: "Dr. John Carter",
        specialty: "General",
        hospital: "Family Health Center",
        rating: 4.6,
        reviews: 120,
        image: "https://randomuser.me/api/portraits/men/12.jpg"
      }
    ];
    await Doctor.deleteMany({});
    const docs = await Doctor.insertMany(sample);
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: 'Seed error', error: err.message });
  }
});

module.exports = router; 