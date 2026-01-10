import logo from './logo.svg';
import './App.css';
import {usestate,useEffect} from "react";
import { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [savedCities, setSavedCities] = useState([]);


  const getWeather = async () => {
    const res = await fetch(
      `http://127.0.0.1:8000/api/weather/?city=${city}`
    );
    const data = await res.json();
    setWeather(data);
  };
  const saveCity = async () => {
  await fetch("http://127.0.0.1:8000/api/save-city/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ city: weather.city }),
  });
  fetchSavedCities();
};
const fetchSavedCities = async () => {
  const res = await fetch("http://127.0.0.1:8000/api/saved-cities/");
  const data = await res.json();
  setSavedCities(data);
};
useEffect(() => {
  fetchSavedCities();
}, []);




  return (
    <div style={{
  padding: "40px",
  fontFamily: "Arial",
  background: "linear-gradient(135deg, #74ebd5, #ACB6E5)",
  minHeight: "100vh"
}}>

      <h1>Weather App</h1>

      <input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city"
        style = {{
          padding: "10px",
          fontSize : "16px",
          borderRadius : "8px",
          border : "none", 
          marginRight :"10px"
        }}
      />
      <button
  onClick={getWeather}
  style={{
    padding: "10px 16px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#ff9800",
    color: "white",
    cursor: "pointer"
  }}
>
  Get Weather
</button>

      {weather && weather.temp && (
        <div style={{
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    marginTop: "20px",
    width: "300px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
  }}> 
          <h2>{weather.city}</h2>
          <p>Temp: {weather.temp} °C</p>
          <p>{weather.description}</p>
        </div>
      )}
      {weather && weather.city && (
  <button onClick={saveCity}>Save City</button>
)}

<h3>Saved Cities</h3>
<ul>
  {savedCities.map((c) => (
    <li key={c.id}>{c.name}</li>
  ))}
</ul>



      {weather && weather.error && <p>{weather.error}</p>}
    </div>
  );
}

export default App;
