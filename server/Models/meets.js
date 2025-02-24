const mongoose = require('mongoose');
const meetSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 18000 // 1800 seconds = 30 minutes
  }
});

module.exports = mongoose.model('Meet', meetSchema);
