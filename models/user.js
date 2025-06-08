const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: {
    type: String,
    enum: ['head', 'security'],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
