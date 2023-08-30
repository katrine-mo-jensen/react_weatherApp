import React, { useEffect, useState } from "react";

export function Fetching() {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);

  function handleLocationClick() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.log("Geolocation not supported");
    }
  }

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    setLocation({ latitude, longitude });
  }

  function error() {
    console.log("Unable to retrieve your location");
  }

  useEffect(() => {
    if (location) {
      const { latitude, longitude } = location;

      // Make API call to OpenWeatherMap
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&lon=${longitude}&hourly=temperature_2m&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,windspeed_10m_max&timezone=Europe%2FBerlin&forecast_days=14`
      )
        .then((response) => response.json())
        .then((data) => {
          setWeather(data);
          console.log("Weather data:", data); // Log the fetched weather data
        })
        .catch((error) => {
          console.error("Error fetching weather data:", error);
        });
    }
  }, [location]);

  console.log("Location:", location); // Log the location data

  return (
    <div>
      {!location ? (
        <button onClick={handleLocationClick}>Get Location</button>
      ) : null}
      {location && !weather ? <p>Loading weather data...</p> : null}
      {weather ? (
        <div>
          <h2>Weather Data</h2>
          <p>Temperature: {weather.hourly.temperature_2m[0]}°C</p>
          <p>Max Temperature: {weather.daily.temperature_2m_max[0]}°C</p>
          <p>Min Temperature: {weather.daily.temperature_2m_min[0]}°C</p>
        </div>
      ) : null}
    </div>
  );
}
