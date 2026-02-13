'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/common/logo';
import { 
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  Target, 
  TrendingUp, 
  MessageCircle, 
  Bot, 
  Settings,
  LogOut,
  User
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

interface SidebarProps {
  className?: string;
  collapsed?: boolean;
}

export function Sidebar({ className, collapsed = false }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn(
      "flex flex-col h-screen bg-sidebar border-r border-sidebar-border",
      "transition-all duration-300 ease-in-out",
      collapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-center h-16 px-4 border-b border-sidebar-border">
        {collapsed ? (
          <Logo variant="mark" size="sm" />
        ) : (
          <Logo size="sm" />
        )}
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
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  "group relative",
                  isActive 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm" 
                    : "text-sidebar-foreground"
                )}
              >
                <Icon className={cn(
                  "flex-shrink-0 w-5 h-5 transition-colors",
                  isActive && "text-sidebar-primary-foreground"
                )} />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <Badge 
                        variant="secondary" 
                        className="ml-auto text-xs bg-primary text-primary-foreground"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 pointer-events-none whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <Separator />

      {/* Bottom Section */}
      <div className="p-3 space-y-1">
        <Link
          href="/dashboard/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            "text-sidebar-foreground group relative",
            pathname === '/dashboard/settings' && "bg-sidebar-primary text-sidebar-primary-foreground"
          )}
        >
          <Settings className="flex-shrink-0 w-5 h-5" />
          {!collapsed && <span>Settings</span>}
          {collapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 pointer-events-none">
              Settings
            </div>
          )}
        </Link>

        {/* User Profile */}
        <div className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg",
          "border border-sidebar-border bg-sidebar-accent/50"
        )}>
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                John Doe
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                Athlete
              </p>
            </div>
          )}
        </div>

        {!collapsed && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </Button>
        )}
      </div>
    </aside>
  );
}