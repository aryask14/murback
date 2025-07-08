const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number },
  blood: { type: String },
  state: { type: String },
  city: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); 