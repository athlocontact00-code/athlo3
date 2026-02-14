'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Clock, 
  Mail, 
  MessageSquare,
  Bot,
  Trophy,
  Users,
  MoonIcon,
  Sun,
  Smartphone
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// Types
interface NotificationCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  settings: {
    push: boolean;
    email: boolean;
  };
}

interface QuietHours {
  enabled: boolean;
  startTime: string;
  endTime: string;
}

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
};

export function NotificationSettings() {
  // Master toggles
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  
  // Quiet hours
  const [quietHours, setQuietHours] = useState<QuietHours>({
    enabled: true,
    startTime: '22:00',
    endTime: '07:00'
  });

  // Notification categories
  const [categories, setCategories] = useState<NotificationCategory[]>([
    {
      id: 'training_reminders',
      name: 'Training Reminders',
      description: 'Get notified before your scheduled workouts',
      icon: Clock,
      settings: {
        push: true,
        email: false
      }
    },
    {
      id: 'checkin_reminders',
      name: 'Check-in Reminders',
      description: 'Daily reminders for morning wellness check-ins',
      icon: Sun,
      settings: {
        push: true,
        email: false
      }
    },
    {
      id: 'coach_messages',
      name: 'Coach Messages',
      description: 'New messages from your coach or training team',
      icon: MessageSquare,
      settings: {
        push: true,
        email: true
      }
    },
    {
      id: 'ai_insights',
      name: 'AI Insights',
      description: 'Personalized training insights and recommendations',
      icon: Bot,
      settings: {
        push: true,
        email: false
      }
    },
    {
      id: 'weekly_digest',
      name: 'Weekly Digest Email',
      description: 'Summary of your training week and upcoming plans',
      icon: Mail,
      settings: {
        push: false,
        email: true
      }
    },
    {
      id: 'achievement_alerts',
      name: 'Achievement Alerts',
      description: 'Celebrate personal records and training milestones',
      icon: Trophy,
      settings: {
        push: true,
        email: false
      }
    },
    {
      id: 'team_activity',
      name: 'Team Activity',
      description: 'Updates when teammates complete workouts or share achievements',
      icon: Users,
      settings: {
        push: false,
        email: false
      }
    }
  ]);

  const updateCategorySetting = (categoryId: string, settingType: 'push' | 'email', value: boolean) => {
    setCategories(prev => 
      prev.map(category => 
        category.id === categoryId 
          ? {
              ...category,
              settings: {
                ...category.settings,
                [settingType]: value
              }
            }
          : category
      )
    );
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const saveSettings = () => {
    // In a real app, this would save to backend
    console.log('Saving notification settings...', {
      pushNotifications,
      emailNotifications,
      quietHours,
      categories
    });
  };

  return (
    <motion.div 
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground flex items-center space-x-2">
          <Bell className="w-6 h-6 text-primary" />
          <span>Notification Preferences</span>
        </h2>
        <p className="text-muted-foreground">
          Control how and when you receive notifications from ATHLO
        </p>
      </div>

      {/* Master Controls */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Smartphone className="w-5 h-5 text-primary" />
            <span>Master Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Push Notifications Master Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="push-master" className="text-base font-medium">
                Push Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications on your device
              </p>
            </div>
            <Switch
              id="push-master"
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>

          <Separator />

          {/* Email Notifications Master Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="email-master" className="text-base font-medium">
                Email Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch
              id="email-master"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <MoonIcon className="w-5 h-5 text-primary" />
            <span>Quiet Hours</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="quiet-hours" className="text-base font-medium">
                Enable Quiet Hours
              </Label>
              <p className="text-sm text-muted-foreground">
                Pause non-urgent notifications during these hours
              </p>
            </div>
            <Switch
              id="quiet-hours"
              checked={quietHours.enabled}
              onCheckedChange={(checked) => 
                setQuietHours(prev => ({ ...prev, enabled: checked }))
              }
            />
          </div>

          {quietHours.enabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-2">
                <Label htmlFor="start-time">From</Label>
                <input
                  id="start-time"
                  type="time"
                  value={quietHours.startTime}
                  onChange={(e) => 
                    setQuietHours(prev => ({ ...prev, startTime: e.target.value }))
                  }
                  className="w-full p-2 rounded-md border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p className="text-xs text-muted-foreground">
                  {formatTime(quietHours.startTime)}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-time">To</Label>
                <input
                  id="end-time"
                  type="time"
                  value={quietHours.endTime}
                  onChange={(e) => 
                    setQuietHours(prev => ({ ...prev, endTime: e.target.value }))
                  }
                  className="w-full p-2 rounded-md border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p className="text-xs text-muted-foreground">
                  {formatTime(quietHours.endTime)}
                </p>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Notification Categories */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Notification Categories</CardTitle>
          <p className="text-sm text-muted-foreground">
            Customize notifications for different types of updates
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const pushDisabled = !pushNotifications;
            const emailDisabled = !emailNotifications;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="space-y-4"
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg mt-1">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{category.name}</h4>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </div>

                <div className="ml-11 grid grid-cols-2 gap-4">
                  {/* Push Notification Toggle */}
                  <div className="flex items-center justify-between">
                    <Label 
                      htmlFor={`${category.id}-push`}
                      className={cn(
                        "text-sm",
                        pushDisabled && "text-muted-foreground"
                      )}
                    >
                      Push
                    </Label>
                    <Switch
                      id={`${category.id}-push`}
                      checked={category.settings.push && !pushDisabled}
                      onCheckedChange={(checked) => 
                        updateCategorySetting(category.id, 'push', checked)
                      }
                      disabled={pushDisabled}
                    />
                  </div>

                  {/* Email Toggle */}
                  <div className="flex items-center justify-between">
                    <Label 
                      htmlFor={`${category.id}-email`}
                      className={cn(
                        "text-sm",
                        emailDisabled && "text-muted-foreground"
                      )}
                    >
                      Email
                    </Label>
                    <Switch
                      id={`${category.id}-email`}
                      checked={category.settings.email && !emailDisabled}
                      onCheckedChange={(checked) => 
                        updateCategorySetting(category.id, 'email', checked)
                      }
                      disabled={emailDisabled}
                    />
                  </div>
                </div>

                {index < categories.length - 1 && (
                  <Separator className="mt-6" />
                )}
              </motion.div>
            );
          })}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <Button onClick={saveSettings} className="min-w-32">
          Save Changes
        </Button>
      </div>
    </motion.div>
  );
}