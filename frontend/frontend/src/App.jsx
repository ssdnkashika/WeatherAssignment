import React, { useState, useEffect } from "react";
import axios from "axios";
import clouds from "./assets/clouds.jpg";  
import rainy from "./assets/rainy.jpg";
import clear from "./assets/clear.jpg";
import snow from "./assets/snow.jpg";
import sunny from "./assets/sunny.jpg";
import thunder from "./assets/thunder.jpg";
import drizzle from "./assets/drizzle.jpg";
import mist from "./assets/mist.jpg";
import "./App.css"; // Ensure you import your CSS file

const App = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Load favorite cities from local storage on component mount
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  const getWeatherByCity = async (city) => {
    setError(""); // Clear previous error
    try {
      const response = await axios.get(`http://localhost:3000/api/weather?city=${city}`);
      setWeatherData(response.data);
      changeBg(response.data.weather[0].main); // Call to change background
    } catch (err) {
      setError("Error fetching weather data");
    }
  };

  const getWeatherByLocation = async () => {
    setError(""); // Clear previous error
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await axios.get(`http://localhost:3000/api/weather?lat=${latitude}&lon=${longitude}`);
          setWeatherData(response.data);
          changeBg(response.data.weather[0].main); // Call to change background
        } catch (err) {
          setError("Error fetching weather data");
        }
      }, () => {
        setError("Unable to retrieve location.");
      });
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  const changeBg = (status) => {
    let backgroundImage = "";
    switch (status) {
      case 'Clouds':
        backgroundImage = `url(${clouds})`;
        break;
      case 'Clear':
        backgroundImage = `url(${clear})`;
        break;
      case 'Snow':
        backgroundImage = `url(${snow})`;
        break;
      case 'Sunny':
        backgroundImage = `url(${sunny})`;
        break;
      case 'Rain':
        backgroundImage = `url(${rainy})`;
        break;
      case 'Thunderstorm':
        backgroundImage = `url(${thunder})`;
        break;
      case 'Drizzle':
        backgroundImage = `url(${drizzle})`;
        break;
      case 'Mist':
      case 'Haze':
      case 'Fog':
        backgroundImage = `url(${mist})`;
        break;
      default:
        backgroundImage = `url(${clear})`; // Default image
    }
    document.body.style.backgroundImage = backgroundImage;
  };

  const saveFavorite = (city) => {
    if (city && !favorites.includes(city)) {
      const updatedFavorites = [...favorites, city];
      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    }
  };

  const deleteFavorite = (cityToDelete) => {
    const updatedFavorites = favorites.filter((favorite) => favorite !== cityToDelete);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="app">
      <div className="header">
        <h4>Weather App</h4>
      </div>
      <div className="app-main">
        <input
          type="text"
          className="input-box"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={() => { getWeatherByCity(city); saveFavorite(city); }}>Get Weather</button>
        {/* <button onClick={getWeatherByLocation}>Get Current Location Weather</button> */}

        {error && <div className="error">{error}</div>}

        {weatherData && (
          <div className="weather-body" style={{ display: "block" }}>
            <div className="location-details">
              Weather in {weatherData.name}, {weatherData.sys.country}
            </div>
            <div className="temp">
              {Math.round(weatherData.main.temp - 273.15)}°C
            </div>
            <div className="weather-status">
              <div className="weather">{weatherData.weather[0].description}</div>
              <div className="min-max">
                Wind Speed: {weatherData.wind.speed} m/s
              </div>
              <div className="min-max">
                Humidity: {weatherData.main.humidity}%
              </div>
            </div>
          </div>
        )}

{favorites.length > 0 && (
  <div className="favorites">
    <h4>Favorite Cities</h4>
    <ul>
      {favorites.map((favorite, index) => (
        <li key={index}>
          {favorite} 
          <button className="delete-button" onClick={() => deleteFavorite(favorite)}>D</button>
        </li>
      ))}
    </ul>
  </div>
)}

      </div>
    </div>
  );
};

export default App;
