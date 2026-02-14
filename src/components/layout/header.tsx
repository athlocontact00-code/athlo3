'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MobileNav } from './mobile-nav';
import { ThemeToggle } from './theme-toggle';
import { 
  Search, 
  Bell,
  User,
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface HeaderProps {
  className?: string;
}

// Define breadcrumb mapping for routes
const getBreadcrumb = (pathname: string) => {
  if (pathname === '/dashboard') return ['Dashboard'];
  if (pathname === '/dashboard/calendar') return ['Dashboard', 'Calendar'];
  if (pathname === '/dashboard/plan') return ['Dashboard', 'Plan'];
  if (pathname === '/dashboard/diary') return ['Dashboard', 'Diary'];
  if (pathname === '/dashboard/progress') return ['Dashboard', 'Progress'];
  if (pathname === '/dashboard/progress/pmc') return ['Dashboard', 'Progress', 'PMC'];
  if (pathname === '/dashboard/messages') return ['Dashboard', 'Messages'];
  if (pathname === '/dashboard/ai-coach') return ['Dashboard', 'AI Coach'];
  if (pathname === '/dashboard/settings') return ['Dashboard', 'Settings'];
  if (pathname === '/dashboard/billing') return ['Dashboard', 'Billing'];
  
  // Default fallback
  const segments = pathname.split('/').filter(Boolean);
  if (segments[0] === 'dashboard') {
    return ['Dashboard', ...segments.slice(1).map(segment => 
      segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ')
    )];
  }
  
  return ['Dashboard'];
};

export function Header({ className }: HeaderProps) {
  const pathname = usePathname();
  const breadcrumb = getBreadcrumb(pathname);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll for backdrop blur effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Command palette handler
  const openCommandPalette = () => {
    // TODO: Implement command palette
    console.log('Opening command palette...');
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b transition-all duration-200",
      isScrolled 
        ? "border-border/50 bg-background/80 backdrop-blur-md shadow-sm" 
        : "border-border/30 bg-background",
      className
    )}>
      <div className="flex h-14 items-center justify-between px-4 lg:px-6">
        {/* Left Section - Breadcrumb */}
        <div className="flex items-center gap-2">
          {/* Mobile Navigation */}
          <div className="lg:hidden">
            <MobileNav />
          </div>
          
          {/* Breadcrumb Navigation */}
          <nav className="hidden sm:flex items-center gap-1 text-sm">
            {breadcrumb.map((crumb, index) => (
              <div key={crumb} className="flex items-center gap-1">
                {index > 0 && (
                  <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
                )}
                <span 
                  className={cn(
                    "transition-colors duration-150",
                    index === breadcrumb.length - 1 
                      ? "text-foreground font-medium" 
                      : "text-muted-foreground hover:text-foreground/80 cursor-pointer"
                  )}
                >
                  {crumb}
                </span>
              </div>
            ))}
          </nav>
        </div>

        {/* Center Section - Intentionally Empty (Clean Design) */}
        <div />

        {/* Right Section */}
        <div className="flex items-center gap-1">
          {/* Search / Command Palette */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={openCommandPalette}
            className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-150"
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">Search (⌘K)</span>
          </Button>

          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="sm"
            className="relative h-9 w-9 p-0 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-150"
          >
            <Bell className="h-4 w-4" />
            {hasUnreadNotifications && (
              <div className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-primary rounded-full" />
            )}
            <span className="sr-only">Notifications</span>
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Avatar Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-9 w-9 rounded-full p-0 hover:bg-accent/50 transition-all duration-150"
              >
                <Avatar className="h-7 w-7">
                  <AvatarImage src="" alt="Bartek" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                    B
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent 
              className="w-56 mr-4 mt-2" 
              align="end" 
              sideOffset={4}
              forceMount
            >
              <DropdownMenuLabel className="font-normal p-3">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Bartek</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    bartek@athlo.com
                  </p>
                </div>
              </DropdownMenuLabel>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem asChild>
                <Link 
                  href="/dashboard/settings" 
                  className="flex items-center cursor-pointer"
                >
                  <User className="mr-3 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link 
                  href="/dashboard/settings" 
                  className="flex items-center cursor-pointer"
                >
                  <Settings className="mr-3 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950">
                <LogOut className="mr-3 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}