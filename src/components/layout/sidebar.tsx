'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/common/logo';
import { 
  Sun,
  LayoutDashboard, 
  Calendar, 
  Target,
  BookOpen, 
  TrendingUp,
  Heart,
  Trophy,
  History,
  MessageCircle,
  Activity,
  Bot, 
  Settings,
  CreditCard,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  unreadCount?: number;
}

interface NavigationSection {
  label: string;
  items: NavigationItem[];
}

const navigationSections: NavigationSection[] = [
  {
    label: 'Main',
    items: [
      {
        label: 'Today',
        href: '/dashboard/today',
        icon: Sun,
      },
      {
        label: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
      },
      {
        label: 'Calendar',
        href: '/dashboard/calendar',
        icon: Calendar,
      },
      {
        label: 'Plan',
        href: '/dashboard/plan',
        icon: Target,
      },
    ],
  },
  {
    label: 'Track',
    items: [
      {
        label: 'Diary',
        href: '/dashboard/diary',
        icon: BookOpen,
      },
      {
        label: 'Progress',
        href: '/dashboard/progress',
        icon: TrendingUp,
      },
      {
        label: 'Status',
        href: '/dashboard/status',
        icon: Heart,
      },
      {
        label: 'Records',
        href: '/dashboard/records',
        icon: Trophy,
      },
      {
        label: 'History',
        href: '/dashboard/history',
        icon: History,
      },
    ],
  },
  {
    label: 'Social',
    items: [
      {
        label: 'Messages',
        href: '/dashboard/messages',
        icon: MessageCircle,
        unreadCount: 2, // Unread indicator (red dot, not number)
      },
      {
        label: 'Feed',
        href: '/dashboard/feed',
        icon: Activity,
      },
      {
        label: 'AI Coach',
        href: '/dashboard/ai-coach',
        icon: Bot,
      },
    ],
  },
  {
    label: 'Account',
    items: [
      {
        label: 'Settings',
        href: '/dashboard/settings',
        icon: Settings,
      },
      {
        label: 'Billing',
        href: '/dashboard/billing',
        icon: CreditCard,
      },
      {
        label: 'Profile',
        href: '/dashboard/profile',
        icon: User,
      },
    ],
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className={cn(
      "flex flex-col h-screen bg-sidebar border-r border-sidebar-border/50",
      "transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)",
      collapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Logo Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border/30">
        {collapsed ? (
          <Logo variant="mark" size="sm" />
        ) : (
          <>
            <Logo size="sm" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className="h-8 w-8 p-0 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </>
        )}
        
        {collapsed && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="absolute left-12 top-4 h-8 w-8 p-0 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 z-50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-6">
        <div className="space-y-8">
          {navigationSections.map((section) => (
            <div key={section.label}>
              {/* Section Label */}
              {!collapsed && (
                <div className="px-3 mb-3">
                  <h3 className="text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider">
                    {section.label}
                  </h3>
                </div>
              )}
              
              {/* Section Items */}
              <nav className="space-y-1">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium",
                        "transition-all duration-200 ease-out relative",
                        active 
                          ? "bg-primary/10 text-white border-l-2 border-primary ml-1 pl-2" 
                          : "text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 border-l-2 border-transparent ml-1 pl-2"
                      )}
                    >
                      {/* Active indicator line */}
                      {active && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-full" />
                      )}
                      
                      <Icon className={cn(
                        "flex-shrink-0 transition-colors duration-200",
                        "w-5 h-5", // Consistent 20px size
                        active ? "text-primary" : "text-sidebar-foreground/60 group-hover:text-sidebar-foreground"
                      )} />
                      
                      {!collapsed && (
                        <>
                          <span className="flex-1">{item.label}</span>
                          {/* Unread indicator - small red dot, not number */}
                          {item.unreadCount && item.unreadCount > 0 && (
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                          )}
                        </>
                      )}
                      
                      {/* Tooltip for collapsed state */}
                      {collapsed && (
                        <div className="absolute left-full ml-6 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50">
                          {item.label}
                          {item.unreadCount && item.unreadCount > 0 && (
                            <div className="ml-2 w-2 h-2 bg-primary rounded-full inline-block" />
                          )}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom User Section */}
      <div className="border-t border-sidebar-border/30 p-4">
        {!collapsed ? (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-sidebar-accent/30">
            {/* User Avatar - small circle */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                Bartek
              </p>
              <div className="flex items-center gap-2">
                {/* Role badge */}
                <Badge 
                  variant="secondary" 
                  className="text-xs px-2 py-0.5 bg-primary/20 text-primary border-none"
                >
                  Athlete
                </Badge>
              </div>
            </div>
          </div>
        ) : (
          <div className="group relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto">
              <User className="w-4 h-4 text-white" />
            </div>
            
            {/* Tooltip for collapsed state */}
            <div className="absolute left-full ml-6 bottom-0 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50">
              <div className="font-medium">Bartek</div>
              <div className="text-xs text-muted-foreground">Athlete</div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}