'use client';

import { FocusDayCard } from '@/components/dashboard/focus-day-card';
import { ReadinessScore } from '@/components/dashboard/readiness-score';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { WeeklyLoadChart } from '@/components/dashboard/weekly-load-chart';

export default function DashboardPage() {
  const handleCheckIn = () => {
    // Navigate to check-in flow
    window.location.href = '/dashboard/diary?action=checkin';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Your training overview for {new Date().toLocaleDateString('en', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Focus Day */}
        <div className="lg:col-span-2">
          <FocusDayCard className="h-full" />
        </div>

        {/* Right Column - Readiness */}
        <div>
          <ReadinessScore 
            className="h-full"
            onCheckIn={handleCheckIn}
          />
        </div>
      </div>

      {/* Secondary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <QuickActions />

        {/* Weekly Load */}
        <WeeklyLoadChart />
      </div>

      {/* Additional Insights Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Activity Summary */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">This Week</span>
              <span className="text-sm font-medium text-foreground">5 workouts</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Distance</span>
              <span className="text-sm font-medium text-foreground">42.5 km</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Time</span>
              <span className="text-sm font-medium text-foreground">4h 35m</span>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Upcoming</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Long Run</p>
                <p className="text-xs text-muted-foreground">Tomorrow, 7:00 AM</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Coach Check-in</p>
                <p className="text-xs text-muted-foreground">Friday, 2:00 PM</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Race Day</p>
                <p className="text-xs text-muted-foreground">Next Sunday</p>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement/Goal Progress */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Goals</h3>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">Weekly Distance</span>
                <span className="text-sm font-medium text-foreground">42.5/50 km</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">Monthly Workouts</span>
                <span className="text-sm font-medium text-foreground">18/20</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '90%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}