// utils/openai.js
const axios = require('axios');
const { OPENWEATHERMAP_API_KEY, OPENAI_API_KEY } = process.env;

// Function to generate weather report using OpenAI API
async function generateWeatherReport(location) {
  try {
    // Fetch weather data from OpenWeatherMap API
    const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${OPENWEATHERMAP_API_KEY}`);
    const weatherDescription = weatherResponse.data.weather[0].description;

    // Generate weather report using OpenAI API
    const openaiResponse = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
      prompt: `Today's weather in ${location} is ${weatherDescription}.`,
      max_tokens: 100,
      stop: ['\n', 'Weather in'],
      temperature: 0.7,
      api_key: OPENAI_API_KEY,
    });

    const weatherReport = openaiResponse.data.choices[0].text.trim();
    return weatherReport;
  } catch (err) {
    console.error('Error generating weather report:', err);
    return 'Weather report generation failed.';
  }
}

module.exports = { generateWeatherReport };
