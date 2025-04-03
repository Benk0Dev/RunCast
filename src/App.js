import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Body from './components/Body';
import { updateTheme } from './utils/Theme';
import getWeather from './api/weather';
import getSearchSuggestions from './api/suggestions'; //

function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSearch, setCurrentSearch] = useState("London");
  const [suggestions, setSuggestions] = useState([]);

  const [mode, setMode] = useState(localStorage.getItem("mode") || "basic");
  const [tempUnits, setTempUnits] = useState(localStorage.getItem("tempUnits") || "c");
  const [speedUnits, setSpeedUnits] = useState(localStorage.getItem("speedUnits") || "m/s");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "system");

  useEffect(() => {
    async function inititalize() {
      if (!localStorage.getItem("theme")) {
        localStorage.setItem("theme", "system");
      }
      setMode(localStorage.getItem("mode"));
      setTempUnits(localStorage.getItem("tempUnits"));
      setSpeedUnits(localStorage.getItem("speedUnits"));
      updateTheme();
      await handleSearch(currentSearch);
      setLoading(false);
    }
    inititalize();
  }
  , []);

  useEffect(() => {
    handleSearch(currentSearch);
  }, [tempUnits, speedUnits]);

  async function handleSearch(search) {  
    if (!search || search.trim() === "") return;

    let response = await getWeather(search, tempUnits);
    if (!response) return;

    let weather = response.weatherResponse;
    let forecast = response.forecastResponse;
    let recentRain = response.recentRain;
    let extra = response.extra.current;
    let airQuality = response.airQuality;
    
    // Convert wind speed units
    const rawSpeed = weather.wind.speed;
    const apiSpeedUnit = tempUnits === "c" ? "m/s" : "mph";
  
    let convertedSpeed;
  
    if (apiSpeedUnit === "m/s" && speedUnits === "mph") {
      convertedSpeed = rawSpeed * 2.23694;
    } else if (apiSpeedUnit === "mph" && speedUnits === "m/s") {
      convertedSpeed = rawSpeed / 2.23694;
    } else {
      convertedSpeed = rawSpeed;
    }
  
    weather.wind.speed = Math.round(convertedSpeed * 10) / 10;
    weather.wind.unit = speedUnits;

    const roundedWeather = Object.fromEntries(Object.entries(weather.main).map(([key, value]) => [key, Math.round(value)]));
    weather.main = roundedWeather;

    const roundedForecastWeather = forecast.list.map(item => {
      const roundedMain = Object.fromEntries(Object.entries(item.main).map(([key, value]) => [key, Math.round(value)]));
      item.main = roundedMain;
      const rawSpeed = item.wind.speed;
      const apiSpeedUnit = tempUnits === "c" ? "m/s" : "mph";
    
      let convertedSpeed;
    
      if (apiSpeedUnit === "m/s" && speedUnits === "mph") {
        convertedSpeed = rawSpeed * 2.23694;
      } else if (apiSpeedUnit === "mph" && speedUnits === "m/s") {
        convertedSpeed = rawSpeed / 2.23694;
      } else {
        convertedSpeed = rawSpeed;
      }

      item.wind.speed = Math.round(convertedSpeed * 10) / 10;
      item.wind.unit = speedUnits;
      return item;
    }
    );
    forecast.list = roundedForecastWeather;
  
    setWeather({
      weather,
      forecast,
      recentRain,
      extra,
      airQuality,
    });
    setCurrentSearch(search);
  }

  function handleModeChange(newMode) {
    setMode(newMode);
    localStorage.setItem("mode", newMode);
  }

  function handleUnitsChange(newTempUnit, newSpeedUnit) {
    setTempUnits(newTempUnit);
    setSpeedUnits(newSpeedUnit);
    localStorage.setItem("tempUnits", newTempUnit);
    localStorage.setItem("speedUnits", newSpeedUnit);
  }

  function handleThemeChange(newTheme) {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    updateTheme();
  }

  async function handleSearchInputChange(input) {
    if (!input || input.trim() === "") {
      setSuggestions([]);
      return;
    }
  
    try {
      const fetchedSuggestions = await getSearchSuggestions(input); // aaaaaaaaaaaaaaa
      setSuggestions(fetchedSuggestions || []);
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
    }
  }

  return (
    loading ? <div className="App"></div> : (
      <div className="App">
        <Navbar 
          handleSearch={handleSearch}
          handleSearchInputChange={handleSearchInputChange}
          suggestions={suggestions} 
          mode={mode}
          tempUnits={tempUnits}
          speedUnits={speedUnits}
          theme={theme}
          handleModeChange={handleModeChange}
          handleUnitsChange={handleUnitsChange}
          handleThemeChange={handleThemeChange}
        />
        <Body weather={weather} />
      </div>
    )
  );
}

export default App;
