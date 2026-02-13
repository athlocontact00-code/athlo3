'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User,
  Camera,
  Globe,
  Moon,
  Sun,
  Bell,
  CreditCard,
  Download,
  Trash2,
  Link,
  Smartphone,
  Heart,
  Plus,
  X,
  Calculator,
  Target,
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  sport: string;
  disciplines: string[];
  experienceLevel: string;
  location: string;
  timezone: string;
}

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  types: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
}

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  connected: boolean;
  lastSync?: string;
}

interface SeasonGoal {
  id: string;
  name: string;
  date: string;
  priority: 'A' | 'B' | 'C';
  distance: string;
}

// Mock data
const mockProfile: UserProfile = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  sport: 'Running',
  disciplines: ['Running', 'Cycling', 'Swimming'],
  experienceLevel: 'Intermediate',
  location: 'Warsaw, Poland',
  timezone: 'Europe/Warsaw',
};

const mockNotificationSettings: NotificationSetting[] = [
  {
    id: 'workout_reminders',
    title: 'Workout Reminders',
    description: 'Get notified about upcoming scheduled workouts',
    enabled: true,
    types: { push: true, email: true, sms: false },
  },
  {
    id: 'check_in_reminders',
    title: 'Check-in Reminders',
    description: 'Daily reminders to log your wellness metrics',
    enabled: true,
    types: { push: true, email: false, sms: false },
  },
  {
    id: 'coach_messages',
    title: 'Coach Messages',
    description: 'Messages from your coach or training team',
    enabled: true,
    types: { push: true, email: true, sms: false },
  },
  {
    id: 'ai_insights',
    title: 'AI Insights',
    description: 'Personalized insights and recommendations',
    enabled: true,
    types: { push: true, email: false, sms: false },
  },
  {
    id: 'achievements',
    title: 'Achievements',
    description: 'Celebrate your personal records and milestones',
    enabled: true,
    types: { push: true, email: true, sms: false },
  },
];

const mockIntegrations: Integration[] = [
  {
    id: 'strava',
    name: 'Strava',
    description: 'Sync workouts and performance data',
    icon: '🟠',
    connected: true,
    lastSync: '2024-02-12 08:30',
  },
  {
    id: 'garmin',
    name: 'Garmin Connect',
    description: 'Import data from Garmin devices',
    icon: '🔵',
    connected: false,
  },
  {
    id: 'apple_health',
    name: 'Apple Health',
    description: 'Sync health metrics and workouts',
    icon: '🍎',
    connected: true,
    lastSync: '2024-02-12 07:45',
  },
  {
    id: 'google_fit',
    name: 'Google Fit',
    description: 'Import activity data from Google Fit',
    icon: '🔴',
    connected: false,
  },
];

const mockSeasonGoals: SeasonGoal[] = [
  {
    id: '1',
    name: 'City Marathon',
    date: '2024-10-15',
    priority: 'A',
    distance: '42.2K',
  },
  {
    id: '2',
    name: 'Half Marathon PB',
    date: '2024-06-22',
    priority: 'B',
    distance: '21.1K',
  },
  {
    id: '3',
    name: 'Local 10K Series',
    date: '2024-04-30',
    priority: 'C',
    distance: '10K',
  },
];

const sportsOptions = ['Running', 'Cycling', 'Swimming', 'Triathlon', 'CrossFit', 'Strength Training'];
const languages = [
  { code: 'en', name: 'English' },
  { code: 'pl', name: 'Polski' },
  { code: 'de', name: 'Deutsch' },
];

export default function SettingsPage() {
  const [profile, setProfile] = useState(mockProfile);
  const [notifications, setNotifications] = useState(mockNotificationSettings);
  const [integrations, setIntegrations] = useState(mockIntegrations);
  const [goals, setGoals] = useState(mockSeasonGoals);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleProfileUpdate = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const toggleNotification = (id: string, type?: keyof NotificationSetting['types']) => {
    setNotifications(prev => prev.map(notif => {
      if (notif.id === id) {
        if (type) {
          return {
            ...notif,
            types: { ...notif.types, [type]: !notif.types[type] }
          };
        } else {
          return { ...notif, enabled: !notif.enabled };
        }
      }
      return notif;
    }));
  };

  const toggleIntegration = (id: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === id 
        ? { ...integration, connected: !integration.connected }
        : integration
    ));
  };

  const addGoal = () => {
    const newGoal: SeasonGoal = {
      id: Date.now().toString(),
      name: 'New Race',
      date: '2024-12-31',
      priority: 'C',
      distance: '10K',
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const removeGoal = (id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'A': return 'bg-red-950/30 text-red-400 border-red-600/30';
      case 'B': return 'bg-yellow-950/30 text-yellow-400 border-yellow-600/30';
      case 'C': return 'bg-blue-950/30 text-blue-400 border-blue-600/30';
      default: return 'bg-gray-950/30 text-gray-400 border-gray-600/30';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and application settings
        </p>
      </div>

      {/* Profile Section */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <User className="w-5 h-5" />
          Profile
        </h2>
        
        <div className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <div className="w-full h-full bg-red-600 flex items-center justify-center text-white text-2xl font-medium">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </div>
            </Avatar>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Camera className="w-4 h-4" />
                Upload Photo
              </Button>
              <p className="text-xs text-muted-foreground">
                JPG, PNG up to 5MB
              </p>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <Input
                value={profile.name}
                onChange={(e) => handleProfileUpdate('name', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                value={profile.email}
                onChange={(e) => handleProfileUpdate('email', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <Input
                value={profile.location}
                onChange={(e) => handleProfileUpdate('location', e.target.value)}
                placeholder="City, Country"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Timezone</label>
              <select 
                className="w-full p-2 rounded-lg border border-border bg-background"
                value={profile.timezone}
                onChange={(e) => handleProfileUpdate('timezone', e.target.value)}
              >
                <option value="Europe/Warsaw">Europe/Warsaw</option>
                <option value="America/New_York">America/New_York</option>
                <option value="America/Los_Angeles">America/Los_Angeles</option>
                <option value="Asia/Tokyo">Asia/Tokyo</option>
              </select>
            </div>
          </div>

          {/* Sport Disciplines */}
          <div>
            <label className="block text-sm font-medium mb-2">Sport Disciplines</label>
            <div className="flex flex-wrap gap-2">
              {sportsOptions.map(sport => (
                <Button
                  key={sport}
                  variant={profile.disciplines.includes(sport) ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    const newDisciplines = profile.disciplines.includes(sport)
                      ? profile.disciplines.filter(d => d !== sport)
                      : [...profile.disciplines, sport];
                    handleProfileUpdate('disciplines', newDisciplines);
                  }}
                  className={cn(
                    profile.disciplines.includes(sport) && "bg-red-600 hover:bg-red-700"
                  )}
                >
                  {sport}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Training Zones */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Training Zones
          </h2>
          <Button variant="outline" size="sm" className="gap-2">
            <ExternalLink className="w-4 h-4" />
            Zone Calculator
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-3">Heart Rate Zones</h3>
            <div className="space-y-2">
              {[
                { zone: 'Zone 1', range: '120-140 bpm', color: 'bg-gray-600' },
                { zone: 'Zone 2', range: '140-160 bpm', color: 'bg-blue-600' },
                { zone: 'Zone 3', range: '160-175 bpm', color: 'bg-green-600' },
                { zone: 'Zone 4', range: '175-185 bpm', color: 'bg-yellow-600' },
                { zone: 'Zone 5', range: '185+ bpm', color: 'bg-red-600' },
              ].map(zone => (
                <div key={zone.zone} className="flex items-center justify-between p-2 rounded-lg bg-gray-900/30">
                  <div className="flex items-center gap-3">
                    <div className={cn('w-3 h-3 rounded-full', zone.color)} />
                    <span className="font-medium">{zone.zone}</span>
                  </div>
                  <span className="text-muted-foreground">{zone.range}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Power Zones (Cycling)</h3>
            <div className="space-y-2">
              {[
                { zone: 'Active Recovery', range: '<150W', color: 'bg-gray-600' },
                { zone: 'Endurance', range: '150-200W', color: 'bg-blue-600' },
                { zone: 'Tempo', range: '200-240W', color: 'bg-green-600' },
                { zone: 'Lactate Threshold', range: '240-280W', color: 'bg-yellow-600' },
                { zone: 'VO2 Max', range: '280W+', color: 'bg-red-600' },
              ].map(zone => (
                <div key={zone.zone} className="flex items-center justify-between p-2 rounded-lg bg-gray-900/30">
                  <div className="flex items-center gap-3">
                    <div className={cn('w-3 h-3 rounded-full', zone.color)} />
                    <span className="font-medium">{zone.zone}</span>
                  </div>
                  <span className="text-muted-foreground">{zone.range}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Season Goals */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Target className="w-5 h-5" />
            Season Goals
          </h2>
          <Button variant="outline" size="sm" onClick={addGoal} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Race
          </Button>
        </div>
        
        <div className="space-y-3">
          {goals.map(goal => (
            <div key={goal.id} className="flex items-center justify-between p-4 rounded-lg border border-border/40">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className={getPriorityColor(goal.priority)}>
                  {goal.priority}
                </Badge>
                <div>
                  <div className="font-medium">{goal.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {goal.distance} • {new Date(goal.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeGoal(goal.id)}
                className="text-red-400 hover:text-red-300"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
        
        <p className="text-xs text-muted-foreground mt-4">
          A = Major goal race, B = Important race, C = Fun/training race
        </p>
      </Card>

      {/* Integrations */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Link className="w-5 h-5" />
          Integrations
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map(integration => (
            <div key={integration.id} className="p-4 rounded-lg border border-border/40">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{integration.icon}</span>
                  <div>
                    <div className="font-medium">{integration.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {integration.description}
                    </div>
                  </div>
                </div>
                <Button
                  variant={integration.connected ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleIntegration(integration.id)}
                  className={cn(
                    integration.connected && "bg-green-600 hover:bg-green-700"
                  )}
                >
                  {integration.connected ? 'Disconnect' : 'Connect'}
                </Button>
              </div>
              {integration.connected && integration.lastSync && (
                <p className="text-xs text-muted-foreground">
                  Last sync: {integration.lastSync}
                </p>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notification Preferences
        </h2>
        
        <div className="space-y-4">
          {notifications.map(notification => (
            <div key={notification.id} className="p-4 rounded-lg border border-border/40">
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={notification.enabled}
                      onChange={() => toggleNotification(notification.id)}
                      className="w-4 h-4"
                    />
                    <div>
                      <div className="font-medium">{notification.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {notification.description}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {notification.enabled && (
                <div className="flex gap-4 ml-7">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={notification.types.push}
                      onChange={() => toggleNotification(notification.id, 'push')}
                      className="w-3 h-3"
                    />
                    <Smartphone className="w-3 h-3" />
                    Push
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={notification.types.email}
                      onChange={() => toggleNotification(notification.id, 'email')}
                      className="w-3 h-3"
                    />
                    📧 Email
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={notification.types.sms}
                      onChange={() => toggleNotification(notification.id, 'sms')}
                      className="w-3 h-3"
                    />
                    💬 SMS
                  </label>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* App Preferences */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">App Preferences</h2>
        
        <div className="space-y-6">
          {/* Language */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5" />
              <div>
                <div className="font-medium">Language</div>
                <div className="text-sm text-muted-foreground">
                  Choose your preferred language
                </div>
              </div>
            </div>
            <select 
              className="p-2 rounded-lg border border-border bg-background min-w-[120px]"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>

          {/* Theme */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDarkTheme ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              <div>
                <div className="font-medium">Theme</div>
                <div className="text-sm text-muted-foreground">
                  Choose between light and dark theme
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDarkTheme(!isDarkTheme)}
              className="gap-2"
            >
              {isDarkTheme ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {isDarkTheme ? 'Light' : 'Dark'}
            </Button>
          </div>

          {/* Billing Link */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5" />
              <div>
                <div className="font-medium">Billing & Subscription</div>
                <div className="text-sm text-muted-foreground">
                  Manage your subscription and payment methods
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="w-4 h-4" />
              Manage Billing
            </Button>
          </div>
        </div>
      </Card>

      {/* Data Management */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Data Management</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-border/40">
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-blue-400" />
              <div>
                <div className="font-medium">Export Data</div>
                <div className="text-sm text-muted-foreground">
                  Download all your training data and personal information
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Export
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-lg border border-red-600/30 bg-red-950/10">
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-red-400" />
              <div>
                <div className="font-medium text-red-400">Delete Account</div>
                <div className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              className="border-red-600/50 text-red-400 hover:bg-red-950/20"
            >
              Delete
            </Button>
          </div>
        </div>
      </Card>

      {/* Delete Account Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4 text-red-400">Delete Account</h3>
            <p className="text-sm text-muted-foreground mb-6">
              This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-red-600/50 text-red-400 hover:bg-red-950/20"
              >
                Delete Forever
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}