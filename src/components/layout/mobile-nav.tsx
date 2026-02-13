'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Logo } from '@/components/common/logo';
import { 
  Menu,
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  Target, 
  TrendingUp, 
  MessageCircle, 
  Bot, 
  Settings,
  User,
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  description: string;
}

const navigationItems: NavigationItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Overview and Focus Day',
  },
  {
    label: 'Calendar',
    href: '/dashboard/calendar',
    icon: Calendar,
    description: 'Training schedule',
  },
  {
    label: 'Diary',
    href: '/dashboard/diary',
    icon: BookOpen,
    description: 'Check-ins and logs',
  },
  {
    label: 'Plan',
    href: '/dashboard/plan',
    icon: Target,
    description: 'Training plans',
  },
  {
    label: 'Progress',
    href: '/dashboard/progress',
    icon: TrendingUp,
    description: 'Analytics and insights',
  },
  {
    label: 'Messages',
    href: '/dashboard/messages',
    icon: MessageCircle,
    badge: 3,
    description: 'Team communication',
  },
  {
    label: 'AI Coach',
    href: '/dashboard/ai-coach',
    icon: Bot,
    description: 'AI-powered coaching',
  },
];

interface MobileNavProps {
  className?: string;
}

export function MobileNav({ className }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("md:hidden", className)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0 bg-sidebar border-r-sidebar-border">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-sidebar-border">
            <Logo size="sm" />
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-3 space-y-1">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href || 
                  (pathname.startsWith(item.href) && item.href !== '/dashboard');
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      "group",
                      isActive 
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm" 
                        : "text-sidebar-foreground"
                    )}
                  >
                    <Icon className={cn(
                      "flex-shrink-0 w-5 h-5 transition-colors",
                      isActive && "text-sidebar-primary-foreground"
                    )} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span>{item.label}</span>
                        {item.badge && (
                          <Badge 
                            variant="secondary" 
                            className="text-xs bg-primary text-primary-foreground"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-sidebar-foreground/60 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          <Separator />

          {/* Bottom Section */}
          <div className="p-3 space-y-3">
            <Link
              href="/dashboard/settings"
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                "text-sidebar-foreground",
                pathname === '/dashboard/settings' && "bg-sidebar-primary text-sidebar-primary-foreground"
              )}
            >
              <Settings className="flex-shrink-0 w-5 h-5" />
              <div className="flex-1">
                <span>Settings</span>
                <p className="text-xs text-sidebar-foreground/60 mt-0.5">
                  Account and preferences
                </p>
              </div>
            </Link>

            {/* User Profile */}
            <div className={cn(
              "flex items-center gap-3 px-3 py-3 rounded-lg",
              "border border-sidebar-border bg-sidebar-accent/50"
            )}>
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <User className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground">
                  John Doe
                </p>
                <p className="text-xs text-sidebar-foreground/60">
                  Athlete • Premium
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              onClick={() => {
                setOpen(false);
                // Handle sign out
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}