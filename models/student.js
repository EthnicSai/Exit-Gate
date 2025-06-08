const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: String,
  rollNumber: String,
  parentEmail: String,
  picture: Buffer,
  createdAt: { type: Date, default: Date.now } // New field
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
