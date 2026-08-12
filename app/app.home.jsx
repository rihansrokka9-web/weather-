import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router';

const CITIES = [
  { id: 'london', name: 'London', lat: 51.5074, lon: -0.1278 },
  { id: 'newyork', name: 'New York', lat: 40.7128, lon: -74.0060 },
  { id: 'tokyo', name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
  { id: 'sydney', name: 'Sydney', lat: -33.8688, lon: 151.2093 },
  { id: 'cairo', name: 'Cairo', lat: 30.0444, lon: 31.2357 }
];

export default function Home() {
  const { unit } = useOutletContext();
  const [selectedCityId, setSelectedCityId] = useState(() => {
    return localStorage.getItem('lastCity') || CITIES[0].id;
  });
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  const selectedCity = CITIES.find((c) => c.id === selectedCityId);

  useEffect(() => {
    setLoading(true);
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.lat}&longitude=${selectedCity.lon}&current=temperature_2m,relative_humidity_2m`
    )
      .then((res) => res.json())
      .then((data) => {
        setWeather(data.current);
        setLoading(false);
      });

    localStorage.setItem('lastCity', selectedCityId);
  }, [selectedCityId, selectedCity]);

  const displayTemp = (tempC) => {
    if (unit === 'F') {
      return Math.round((tempC * 9) / 5 + 32) + ' °F';
    }
    return Math.round(tempC) + ' °C';
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <label htmlFor="city-select">Select City: </label>
      <select
        id="city-select"
        value={selectedCityId}
        onChange={(e) => setSelectedCityId(e.target.value)}
      >
        {CITIES.map((city) => (
          <option key={city.id} value={city.id}>
            {city.name}
          </option>
        ))}
      </select>

      {loading ? (
        <p>Loading weather...</p>
      ) : (
        <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
          <h3>{selectedCity.name}</h3>
          <p>Temperature: {displayTemp(weather.temperature_2m)}</p>
          <p>Humidity: {weather.relative_humidity_2m}%</p>
        </div>
      )}
    </div>
  );
}
