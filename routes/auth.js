const express = require('express');
const User = require('../models/user');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password, role } = req.body;
  const newUser = new User({ email, password, role });

  try {
    await newUser.save();
    res.redirect('/');
  } catch (error) {
    res.status(500).send('Error registering user: ' + error.message);
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    req.session.isLoggedIn = true;
    req.session.userRole = user.role;
    if (user.role === 'head') {
      res.redirect('/add');
    } else if (user.role === 'security') {
      res.redirect('/notify');
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error logging in' });
  }
});


router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/');
    }
    res.clearCookie('connect.sid'); // clear the cookie that stores the session ID
    res.redirect('/'); // redirect to the login page
  });
});


module.exports = router;
