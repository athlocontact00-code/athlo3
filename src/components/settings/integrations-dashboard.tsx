'use client';

import { motion } from 'framer-motion';
import { Check, Plus, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Integration {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  lastSync?: string;
  description: string;
}

const integrations: Integration[] = [
  { id: 'strava', name: 'Strava', icon: '🟠', connected: true, lastSync: '2 min ago', description: 'Import activities and routes' },
  { id: 'garmin', name: 'Garmin Connect', icon: '🔵', connected: true, lastSync: '1 hour ago', description: 'Sync workouts, HRV, and sleep' },
  { id: 'apple', name: 'Apple Health', icon: '🍎', connected: false, description: 'Heart rate, sleep, and activity data' },
  { id: 'google', name: 'Google Fit', icon: '🟢', connected: false, description: 'Steps, workouts, and health metrics' },
  { id: 'whoop', name: 'WHOOP', icon: '⚫', connected: false, description: 'Recovery, strain, and sleep scores' },
  { id: 'polar', name: 'Polar', icon: '🔴', connected: false, description: 'Training data and running metrics' },
  { id: 'suunto', name: 'Suunto', icon: '🟡', connected: false, description: 'Outdoor sports and GPS data' },
  { id: 'wahoo', name: 'Wahoo', icon: '🔷', connected: false, description: 'Cycling and indoor training data' },
  { id: 'coros', name: 'COROS', icon: '⬜', connected: false, description: 'Running dynamics and training load' },
];

export function IntegrationsDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div>
        <h3 className="text-lg font-semibold text-foreground">Integrations</h3>
        <p className="text-sm text-muted-foreground">Connect your devices and platforms</p>
      </div>

      <div className="grid gap-3">
        {integrations.map((integration, i) => (
          <motion.div
            key={integration.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between bg-card border border-border/30 rounded-xl p-4 hover:border-border/60 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl w-10 h-10 flex items-center justify-center bg-card rounded-lg">
                {integration.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{integration.name}</span>
                  {integration.connected && (
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{integration.description}</p>
                {integration.lastSync && (
                  <p className="text-[10px] text-muted-foreground/60 flex items-center gap-1 mt-0.5">
                    <RefreshCw className="w-2.5 h-2.5" /> Last sync: {integration.lastSync}
                  </p>
                )}
              </div>
            </div>

            {integration.connected ? (
              <Button variant="outline" size="sm" className="text-xs text-muted-foreground">
                Disconnect
              </Button>
            ) : (
              <Button size="sm" className="text-xs">
                <Plus className="w-3 h-3 mr-1" /> Connect
              </Button>
            )}
          </motion.div>
        ))}
      </div>

      <div className="text-center pt-2">
        <button className="text-xs text-muted-foreground hover:text-primary transition-colors">
          Don't see your device? Request an integration →
        </button>
      </div>
    </motion.div>
  );
}
