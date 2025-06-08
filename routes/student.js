const express = require('express');
const Student = require('../models/student');
const TemporaryStudent = require('../models/temporaryStudent');
const PermittedStudent = require('../models/permittedStudent');
const { isAuthenticatedAndAuthorized } = require('../middleware');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.post('/add-student', isAuthenticatedAndAuthorized(['head']), upload.single('photo'), async (req, res) => {
  try {
    const newStudent = new Student({
      name: req.body.name,
      rollNumber: req.body.rollNumber,
      parentEmail: req.body.parentEmail,
      picture: fs.readFileSync(req.file.path)
    });

    await newStudent.save();
    res.json({ message: 'Student details saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving student details' });
  }
});


router.post('/permit-student-details', isAuthenticatedAndAuthorized(['head']), async (req, res) => {
  try {
    const rollNumber = req.body.rollNumber;
    const student = await Student.findOne({ rollNumber });

    if (!student) {
      res.status(404).send('Student not found');
      return;
    }

    const temporaryStudent = new TemporaryStudent({
      name: student.name,
      rollNumber: student.rollNumber,
      parentEmail: student.parentEmail,
      picture: student.picture,
      date: student.createdAt
    });

    await temporaryStudent.save();

    const permittedStudent = await PermittedStudent.findOne({ rollNumber });

    if (permittedStudent) {
      permittedStudent.permitCount += 1;
      await permittedStudent.save();
    } else {
      const newPermittedStudent = new PermittedStudent({
        name: student.name,
        rollNumber: student.rollNumber,
        parentEmail: student.parentEmail,
        picture: student.picture,
        createdAt: student.createdAt,
        permitCount: 1
      });

      await newPermittedStudent.save();
    }

    res.json({ message: 'Student is permitted and stored in both collections' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching and storing student details' });
  }
});


router.get('/permit-student-details', async (req, res) => {
  try {
    const rollNumber = req.query.rollNumber;
    const student = await Student.findOne({ rollNumber });

    if (student) {
      const pictureBase64 = student.picture ? student.picture.toString('base64') : null;
      const studentDetails = {
        name: student.name,
        rollNumber: student.rollNumber,
        parentEmail: student.parentEmail,
        picture: pictureBase64
      };
      res.status(200).json(studentDetails);
    } else {
      res.status(404).send('Student not found');
    }
  } catch (err) {
    console.error('Error retrieving student details:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/get-students', isAuthenticatedAndAuthorized(['head', 'security']), async (req, res) => {
  try {
    const students = await Student.find();

    const response = students.map(student => ({
      name: student.name,
      rollNumber: student.rollNumber,
      parentEmail: student.parentEmail,
      picture: student.picture ? student.picture.toString('base64') : null
    }));

    res.status(200).json(response);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ message: 'Error fetching student data' });
  }
});

module.exports = router;
