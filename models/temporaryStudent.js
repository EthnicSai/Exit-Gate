const mongoose = require('mongoose');
// const studentSchema = require('./student').schema;
const temporaryStudentSchema = new mongoose.Schema({
    rollNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    parentEmail: String,
    picture: { type: Buffer, required: false },
    createdAt: { type: Date, default: Date.now } // New field
});

const TemporaryStudent = mongoose.model('TemporaryStudent', temporaryStudentSchema);

module.exports = TemporaryStudent;


