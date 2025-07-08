const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  hospital: { type: String },
  state: { type: String },
  city: { type: String },
  // Add more fields as needed (e.g., rating, image, etc.)
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema); 