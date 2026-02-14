'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { 
  Home,
  Calendar, 
  Target,
  MessageCircle,
  MoreHorizontal,
  BookOpen,
  TrendingUp,
  Bot,
  Settings,
  CreditCard,
  Menu
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

// Main bottom tabs (5 tabs)
const mainTabs = [
  {
    label: 'Home',
    href: '/dashboard',
    icon: Home,
    activeRoutes: ['/dashboard']
  },
  {
    label: 'Calendar',
    href: '/dashboard/calendar',
    icon: Calendar,
    activeRoutes: ['/dashboard/calendar']
  },
  {
    label: 'Plan',
    href: '/dashboard/plan',
    icon: Target,
    activeRoutes: ['/dashboard/plan']
  },
  {
    label: 'Messages',
    href: '/dashboard/messages',
    icon: MessageCircle,
    activeRoutes: ['/dashboard/messages'],
    unreadCount: 2 // Example unread count
  },
  {
    label: 'More',
    href: '#',
    icon: MoreHorizontal,
    activeRoutes: []
  }
];

// More sheet items
const moreItems = [
  {
    label: 'Diary',
    href: '/dashboard/diary',
    icon: BookOpen,
    description: 'Check-ins and logs'
  },
  {
    label: 'Progress',
    href: '/dashboard/progress',
    icon: TrendingUp,
    description: 'Analytics and insights'
  },
  {
    label: 'AI Coach',
    href: '/dashboard/ai-coach',
    icon: Bot,
    description: 'AI-powered coaching'
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    description: 'Account preferences'
  },
  {
    label: 'Billing',
    href: '/dashboard/billing',
    icon: CreditCard,
    description: 'Plans and billing'
  },
];

interface MobileNavProps {
  className?: string;
}

// Header mobile menu button (for very small screens or specific contexts)
export function MobileNavButton({ className }: MobileNavProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("lg:hidden h-9 w-9", className)}
    >
      <Menu className="h-4 w-4" />
      <span className="sr-only">Toggle navigation menu</span>
    </Button>
  );
}

// Bottom tab bar for mobile navigation
export function MobileNav({ className }: MobileNavProps) {
  const [moreSheetOpen, setMoreSheetOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (tab: typeof mainTabs[0]) => {
    if (tab.href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return tab.activeRoutes.some(route => pathname.startsWith(route));
  };

  const getActiveMoreItem = () => {
    return moreItems.find(item => pathname.startsWith(item.href));
  };

  const activeMoreItem = getActiveMoreItem();

  return (
    <>
      {/* Fixed Bottom Tab Bar */}
      <div className={cn(
        "lg:hidden fixed bottom-0 left-0 right-0 z-50",
        "bg-background/95 backdrop-blur-md border-t border-border/50",
        "safe-area-pb", // Handle notch phones
        className
      )}>
        <nav className="flex items-center justify-around h-16 px-2">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const active = tab.label === 'More' ? activeMoreItem !== undefined : isActive(tab);
            
            // Handle "More" tab specially
            if (tab.label === 'More') {
              return (
                <Button
                  key={tab.label}
                  variant="ghost"
                  onClick={() => setMoreSheetOpen(true)}
                  className={cn(
                    "flex flex-col items-center gap-1 h-12 px-3 py-2",
                    "transition-all duration-150 ease-out",
                    "hover:bg-transparent", // Remove default hover
                    active 
                      ? "text-primary" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-xs font-medium leading-none">
                    {activeMoreItem ? activeMoreItem.label : tab.label}
                  </span>
                </Button>
              );
            }
            
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex flex-col items-center gap-1 h-12 px-3 py-2 rounded-lg",
                  "transition-all duration-150 ease-out relative",
                  "hover:bg-accent/50",
                  active 
                    ? "text-primary bg-accent/30" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="relative">
                  <Icon className="h-6 w-6" />
                  {/* Unread indicator for Messages */}
                  {tab.unreadCount && tab.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full" />
                  )}
                </div>
                <span className="text-xs font-medium leading-none">
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* More Sheet */}
      <Sheet open={moreSheetOpen} onOpenChange={setMoreSheetOpen}>
        <SheetContent 
          side="bottom" 
          className="h-[50vh] rounded-t-xl border-t border-border/50"
        >
          <SheetHeader className="pb-4">
            <SheetTitle className="text-lg font-semibold text-left">More</SheetTitle>
          </SheetHeader>
          
          <div className="grid grid-cols-2 gap-3">
            {moreItems.map((item) => {
              const Icon = item.icon;
              const active = pathname.startsWith(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMoreSheetOpen(false)}
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-xl transition-all duration-150",
                    "border border-border/50 hover:border-border/70 hover:bg-accent/30",
                    active && "border-primary/50 bg-primary/10"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-lg flex-shrink-0",
                    active 
                      ? "bg-primary/20 text-primary" 
                      : "bg-muted text-muted-foreground"
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h4 className={cn(
                      "font-medium text-sm",
                      active ? "text-primary" : "text-foreground"
                    )}>
                      {item.label}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

// MobileNavButton is already exported above