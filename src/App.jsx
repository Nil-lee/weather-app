import { useState } from "react";
import axios from "axios";
import "./app.css";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

function SearchBar({ city, setCity, onSearch }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <div className="search-box">
      <input
        type="text"
        placeholder="請輸入城市名稱（例如 Taipei）"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={handleKeyDown}
        className="input"
      />
      <button onClick={onSearch} className="button">
        查詢
      </button>
    </div>
  );
}

function WeatherCard({ data }) {
  return (
    <div className="card">
      <h2>{data.name}</h2>
      <img
        src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
        alt={data.weather[0].description}
      />
      <p>{data.weather[0].description}</p>
      <p>{data.main.temp}°C</p>
    </div>
  );
}

function StatusMessage({ text, isError = false }) {
  return <p className={isError ? "message error" : "message"}>{text}</p>;
}

export default function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!city.trim()) return;

    setLoading(true);
    setError("");
    setWeatherData(null);

    try {
      const res = await axios.get(
        "https://api.openweathermap.org/data/2.5/weather",
        {
          params: {
            q: city,
            appid: API_KEY,
            units: "metric",
          },
        }
      );

      setWeatherData(res.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("找不到城市，請確認拼字");
      } else {
        setError("發生錯誤，請稍後再試");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">🌤️ 天氣查詢小工具</h1>

      <SearchBar city={city} setCity={setCity} onSearch={handleSearch} />

      {loading && <StatusMessage text="讀取中..." />}
      {error && <StatusMessage text={error} isError />}
      {!loading && !error && !weatherData && (
        <StatusMessage text="請輸入城市開始查詢" />
      )}

      {weatherData && <WeatherCard data={weatherData} />}
    </div>
  );
}
