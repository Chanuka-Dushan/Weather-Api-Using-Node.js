
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const axios = require('axios');
const { OPENWEATHERMAP_API_KEY, GMAIL_USER, GMAIL_PASS } = process.env;
const nodemailer = require('nodemailer');

// Route to store user details
router.post('/', async (req, res) => {
  try {
    const { email, location } = req.body;
    const newUser = new User({ email, location });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to update user's location
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { location } = req.body;
    const updatedUser = await User.findByIdAndUpdate(id, { location }, { new: true });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to get user's weather data for a given day
router.get('/:id/weather', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.json(user.weatherData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Send hourly weather reports
async function sendHourlyWeatherReport(email, location) {
  try {
    const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${OPENWEATHERMAP_API_KEY}`);
    const weatherDescription = weatherResponse.data.weather[0].description;
    
    // Send email using nodemailer
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASS
      }
    });

    let mailOptions = {
      from: GMAIL_USER,
      to: email,
      subject: 'Hourly Weather Report',
      text: `Weather in ${location}: ${weatherDescription}`
    };

    await transporter.sendMail(mailOptions);
    console.log(`Hourly weather report sent to ${email}`);
  } catch (err) {
    console.error('Error sending email:', err);
  }
}

// Schedule sending hourly weather reports
setInterval(() => {
  // Get all users and send weather report for each user
  User.find().then(users => {
    users.forEach(user => {
      sendHourlyWeatherReport(user.email, user.location);
    });
  });
}, 3 * 60 * 60 * 1000); // Every 3 hours

module.exports = router;
