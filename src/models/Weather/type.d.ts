export interface IWeatherData {
  temperature: number;
  description: string;
  icon: string;
  feels_like: number;
}

export interface IWeatherIconProps {
  icon: string;
  className?: string;
}
