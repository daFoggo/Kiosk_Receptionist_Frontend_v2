import { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import {
  WiDaySunny,
  WiDayCloudy,
  WiCloud,
  WiCloudy,
  WiShowers,
  WiDayRainWind,
  WiThunderstorm,
  WiDaySnow,
  WiDayFog,
} from "react-icons/wi";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { IWeatherIconProps, IWeatherData } from "@/models/weather";
import { openWeatherIp } from "@/utils/ip";

const WeatherIcon = ({ icon, className }: IWeatherIconProps) => {
  const icons = {
    "01d": <WiDaySunny className="text-5xl text-yellow-400" />,
    "02d": <WiDayCloudy className="text-5xl text-gray-400" />,
    "03d": <WiCloud className="text-5xl text-gray-400" />,
    "04d": <WiCloudy className="text-5xl text-gray-400" />,
    "09d": <WiShowers className="text-5xl text-blue-400" />,
    "10d": <WiDayRainWind className="text-5xl text-blue-400" />,
    "11d": <WiThunderstorm className="text-5xl text-gray-600" />,
    "13d": <WiDaySnow className="text-5xl text-white" />,
    "50d": <WiDayFog className="text-5xl text-gray-400" />,
  } as const;

  return (
    <span className={className}>
      {icons[icon as keyof typeof icons] || "☀️"}
    </span>
  );
};

const Weather = () => {
  const [weatherData, setWeatherData] = useState<IWeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    getWeatherData();
  }, [i18n.language]);

  const getWeatherData = async () => {
    try {
      setLoading(true);
      const weatherUrl = `${openWeatherIp}&lang=${i18n.language}`;
      const response = await axios.get(weatherUrl);

      const weather: IWeatherData = {
        temperature: response.data.main.temp,
        description: response.data.weather[0].description,
        icon: response.data.weather[0].icon,
        feels_like: response.data.main.feels_like,
      };

      setWeatherData(weather);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="h-full rounded-3xl">
        <CardHeader className="space-y-2">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-8 w-32" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-16 w-24" />
          <Skeleton className="h-8 w-40" />
        </CardContent>
      </Card>
    );
  }

  if (!weatherData) return null;

  const { temperature, description, icon, feels_like } = weatherData;

  return (
    <Card className="h-full rounded-3xl p-4 aspect-square flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0">
        <CardTitle className="text-2xl font-semibold">
          {t("weather.today")}
        </CardTitle>
        <WeatherIcon icon={icon} className="text-4xl" />
      </CardHeader>

      <CardContent className="p-0">
        <div className="flex items-baseline gap-2">
          <p className="text-7xl font-bold">{Math.round(temperature)}°</p>
          <p className="text-xl text-muted-foreground font-semibold">
            {t("weather.feeling")} {Math.round(feels_like)}°
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-0 flex items-center justify-between">
        <p className="text-xl text-muted-foreground font-semibold capitalize">
          {description}
        </p>
      </CardFooter>
    </Card>
  );
};

export default Weather;
