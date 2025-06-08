const mongoose = require('mongoose');

const permittedStudentSchema = new mongoose.Schema({
    rollNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    parentEmail: String,
    picture: { type: Buffer, required: false },
    createdAt: { type: Date, default: Date.now },
    permitCount: { type: Number, default: 1 } // New field for permit count
});

const PermittedStudent = mongoose.model('PermittedStudent', permittedStudentSchema);

module.exports = PermittedStudent;
