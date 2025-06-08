const express = require('express');
const TemporaryStudent = require('../models/temporaryStudent');
const PermittedStudent = require('../models/permittedStudent');
const { isAuthenticatedAndAuthorized } = require('../middleware');
const router = express.Router();

router.get('/notify', isAuthenticatedAndAuthorized(['head', 'security']), async (req, res) => {
  try {
    const userRole=req.session.userRole;
    const temporaryStudents = await TemporaryStudent.find({});
    const studentsWithBase64Pictures = temporaryStudents.map(student => ({
      ...student.toObject(),
      picture: student.picture ? student.picture.toString('base64') : null
    }));
    res.render('notify', { temporaryStudents: studentsWithBase64Pictures, userRole: userRole });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching temporary student details');
  }
});

router.post('/notify-parent', isAuthenticatedAndAuthorized(['head', 'security']), async (req, res) => {
  try {
    const parentPhoneNumber = req.body.parentPhoneNumber;
    // Implement your logic to send notification emails
    res.send('Notification email sent successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error sending notification email');
  }
});

router.post('/delete-student', isAuthenticatedAndAuthorized(['head', 'security']), async (req, res) => {
  try {
    const rollNumber = req.body.rollNumber;
    await TemporaryStudent.findOneAndDelete({ rollNumber });
    res.redirect('notify');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting student details');
  }
});

module.exports = router;