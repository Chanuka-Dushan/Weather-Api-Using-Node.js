
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  location: { type: String, required: true },
  weatherData: [
    {
      date: { type: Date, default: Date.now },
      weather: { type: String }
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
