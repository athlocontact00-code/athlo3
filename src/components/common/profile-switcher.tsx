'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { useUserProfile } from '@/hooks/use-user-profile';
import { UserProfile, profileConfigs } from '@/lib/user-profile';

export function ProfileSwitcher() {
  const { profile, config, setProfile } = useUserProfile();
  const [open, setOpen] = useState(false);

  const handleProfileChange = (newProfile: UserProfile) => {
    setProfile(newProfile);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs border-muted bg-background/50 hover:bg-accent/50 transition-colors"
        >
          <span className="mr-1">{config.icon}</span>
          <span className="hidden sm:inline">Demo: Switch Profile</span>
          <span className="sm:hidden">Profile</span>
          <ChevronDown className="ml-1 h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-80 bg-background/95 backdrop-blur-sm border-muted"
      >
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          Choose Profile Type
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {Object.entries(profileConfigs).map(([key, profileConfig]) => (
          <DropdownMenuItem
            key={key}
            className="p-3 cursor-pointer focus:bg-accent/50 transition-colors"
            onClick={() => handleProfileChange(key as UserProfile)}
          >
            <div className="flex items-start gap-3 w-full">
              <div className="text-lg flex-shrink-0 mt-0.5">
                {profileConfig.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-foreground">
                    {profileConfig.label}
                  </span>
                  {profile === key && (
                    <Badge 
                      variant="secondary" 
                      className="text-xs px-1.5 py-0 bg-primary/20 text-primary border-none"
                    >
                      Current
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {profileConfig.description}
                </p>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        <div className="p-2">
          <p className="text-xs text-muted-foreground text-center">
            This switcher is for demo purposes only
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}