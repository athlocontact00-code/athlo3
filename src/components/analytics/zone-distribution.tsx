'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ZoneData {
  zone: string;
  label: string;
  time: number;
  percentage: number;
  color: string;
}

const mockZoneData: ZoneData[] = [
  { zone: 'Z1', label: 'Recovery', time: 120, percentage: 25, color: 'bg-gray-400' },
  { zone: 'Z2', label: 'Base', time: 180, percentage: 37.5, color: 'bg-blue-500' },
  { zone: 'Z3', label: 'Tempo', time: 90, percentage: 18.75, color: 'bg-green-500' },
  { zone: 'Z4', label: 'Threshold', time: 60, percentage: 12.5, color: 'bg-yellow-500' },
  { zone: 'Z5a', label: 'VO2 Max', time: 20, percentage: 4.17, color: 'bg-orange-500' },
  { zone: 'Z5b', label: 'Anaerobic', time: 10, percentage: 2.08, color: 'bg-red-500' },
];

const timePeriods = ['7D', '14D', '30D', '90D', '1Y'];

export function ZoneDistribution() {
  const [selectedPeriod, setSelectedPeriod] = useState('30D');
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  const totalTime = mockZoneData.reduce((sum, zone) => sum + zone.time, 0);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Training Zone Distribution</h3>
          <p className="text-sm text-gray-400">Time spent in each zone</p>
        </div>
        <div className="flex bg-gray-800 rounded-lg p-1">
          {timePeriods.map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={cn(
                'px-3 py-1 text-xs font-medium rounded-md transition-colors',
                selectedPeriod === period
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              )}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Zone Bar */}
      <div className="mb-4">
        <div className="flex h-8 bg-gray-800 rounded-lg overflow-hidden">
          {mockZoneData.map((zone) => (
            <div
              key={zone.zone}
              className={cn(
                'transition-all duration-200 cursor-pointer',
                zone.color,
                hoveredZone === zone.zone && 'opacity-80 scale-y-110'
              )}
              style={{ width: `${zone.percentage}%` }}
              onMouseEnter={() => setHoveredZone(zone.zone)}
              onMouseLeave={() => setHoveredZone(null)}
            />
          ))}
        </div>
      </div>

      {/* Zone Labels */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {mockZoneData.map((zone) => (
          <div
            key={zone.zone}
            className={cn(
              'flex items-center space-x-2 p-2 rounded-lg transition-colors cursor-pointer',
              hoveredZone === zone.zone
                ? 'bg-gray-800'
                : 'hover:bg-gray-800/50'
            )}
            onMouseEnter={() => setHoveredZone(zone.zone)}
            onMouseLeave={() => setHoveredZone(null)}
          >
            <div className={cn('w-3 h-3 rounded-full', zone.color)} />
            <div>
              <p className="text-xs font-medium text-white">{zone.zone}</p>
              <p className="text-xs text-gray-400">{zone.label}</p>
              <p className="text-xs font-medium text-gray-300">
                {Math.floor(zone.time / 60)}h {zone.time % 60}m
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Hover Details */}
      {hoveredZone && (
        <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
          {(() => {
            const zone = mockZoneData.find(z => z.zone === hoveredZone);
            if (!zone) return null;
            return (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">
                    {zone.zone} - {zone.label}
                  </p>
                  <p className="text-xs text-gray-400">
                    {Math.floor(zone.time / 60)}h {zone.time % 60}m total
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-white">{zone.percentage}%</p>
                  <p className="text-xs text-gray-400">of training time</p>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}