const express = require('express');
const { isAuthenticatedAndAuthorized } = require('../middleware');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('login');
});

router.get('/register', (req, res) => {
  res.render('registration');
});

router.get('/add', isAuthenticatedAndAuthorized(['head']), (req, res) => {
  res.render('add');
});

router.get('/permit-student', isAuthenticatedAndAuthorized(['head']), (req, res) => {
  res.render('permit-student');
});

router.get('/students', (req, res) => {
  res.render('students');
});

module.exports = router;
