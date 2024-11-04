import { useState, useEffect } from "react";
import {
  WiDaySunny,
  WiCloudy,
  WiDayRainWind,
  WiDaySnow,
  WiThunderstorm,
  WiDayFog,
} from "react-icons/wi";
import { openWeatherIp } from "@/utils/ip";
import axios from "axios";
import { Card, CardContent, CardTitle } from "../ui/card";

const Weather = () => {
  const [weatherData, setWeatherData] = useState({
    temperature: 0,
    description: "",
    icon: "N/A",
    feels_like: 0,
  });

  useEffect(() => {
    getWeatherData();
  }, []);

  // Fetch openweather
  const getWeatherData = async () => {
    try {
      const response = await axios.get(openWeatherIp);

      const weather = {
        temperature: response.data.main.temp,
        description: response.data.weather[0].description,
        icon: response.data.weather[0].icon,
        feels_like: response.data.main.feels_like,
      };

      setWeatherData(weather);
    } catch (error) {
      console.error(error);
    }
  };

  // Change icon
  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case "01d":
        return <WiDaySunny className="text-5xl text-yellow-400" />;
      case "02d":
      case "03d":
      case "04d":
        return <WiCloudy className="text-5xl text-gray-400" />;
      case "09d":
      case "10d":
        return <WiDayRainWind className="text-5xl text-blue-400" />;
      case "11d":
        return <WiThunderstorm className="text-5xl text-gray-600" />;
      case "13d":
        return <WiDaySnow className="text-5xl text-white" />;
      case "50d":
        return <WiDayFog className="text-5xl text-gray-400" />;
      default:
        return <WiDaySunny className="text-5xl text-yellow-400" />;
    }
  };

  return (
    <Card className="h-full rounded-3xl flex flex-col justify-between p-4  aspect-square ">
      <CardTitle className="flex justify-between items-center w-full font-semibold my-0">
        {weatherData.icon ? getWeatherIcon(weatherData.icon) : null}
        <p className="text-2xl">Hôm nay</p>
      </CardTitle>
      <CardContent className="flex flex-col p-0 my-0">
        <div className="flex items-baseline gap-2">
          <p className="text-6xl text-secondary-foreground font-bold my-2">
            {weatherData.temperature
              ? Math.round(weatherData.temperature)
              : null}
            °
          </p>
          <p className="text-xl text-muted-foreground font-bold">
            {weatherData.feels_like ? Math.round(weatherData.feels_like) : null}
          </p>
          °
        </div>
        <p className="text-xl text-muted-foreground font-semibold">
          {weatherData.description
            ? weatherData.description.charAt(0).toUpperCase() +
              weatherData.description.slice(1)
            : null}
        </p>
      </CardContent>
    </Card>
  );
};

export default Weather;
