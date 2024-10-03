const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors'); // Import CORS

dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173' // Replace with your frontend's origin
}));
app.use(express.json());

const weatherApiKey = process.env.OPENWEATHER_API_KEY;

// Route to get weather data
app.get('/api/weather', async (req, res) => {
  const { city } = req.query;

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching weather data' });
  }
});

// Start the server and log a message
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
