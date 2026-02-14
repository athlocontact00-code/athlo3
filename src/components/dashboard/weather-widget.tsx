'use client';

import { motion } from 'framer-motion';
import { Sun, Cloud, CloudRain, Wind, Droplets, Thermometer } from 'lucide-react';

const weatherData = {
  temp: 12,
  condition: 'Partly cloudy',
  icon: 'partly-cloudy',
  wind: 15,
  humidity: 65,
  feelsLike: 10,
  recommendation: 'Good conditions for outdoor training. Light jacket recommended.',
  isGood: true,
};

const WeatherIcon = ({ condition }: { condition: string }) => {
  switch (condition) {
    case 'sunny': return <Sun className="w-8 h-8 text-amber-400" />;
    case 'rainy': return <CloudRain className="w-8 h-8 text-blue-400" />;
    default: return <Cloud className="w-8 h-8 text-gray-400" />;
  }
};

export function WeatherWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border/50 rounded-xl p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <WeatherIcon condition={weatherData.icon} />
          <div>
            <div className="text-2xl font-bold text-foreground">{weatherData.temp}°C</div>
            <div className="text-xs text-muted-foreground">{weatherData.condition}</div>
          </div>
        </div>
        <div className="text-right space-y-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Wind className="w-3 h-3" /> {weatherData.wind} km/h
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Droplets className="w-3 h-3" /> {weatherData.humidity}%
          </div>
        </div>
      </div>
      <div className={`text-xs px-2 py-1.5 rounded-md ${weatherData.isGood ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>
        {weatherData.recommendation}
      </div>
    </motion.div>
  );
}
