'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MobileNav } from './mobile-nav';
import { Logo } from '@/components/common/logo';
import { 
  Bell, 
  Search, 
  Plus,
  ChevronDown,
  User,
  Settings,
  LogOut
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

interface HeaderProps {
  className?: string;
  title?: string;
  subtitle?: string;
  showMobileNav?: boolean;
}

export function Header({ 
  className, 
  title,
  subtitle,
  showMobileNav = true 
}: HeaderProps) {
  return (
    <header className={cn(
      "sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md",
      className
    )}>
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {showMobileNav && (
            <MobileNav />
          )}
          
          {/* Mobile Logo */}
          <div className="md:hidden">
            <Logo variant="mark" size="sm" />
          </div>

          {/* Page Title */}
          {title && (
            <div className="hidden sm:block">
              <h1 className="text-xl font-semibold text-foreground">{title}</h1>
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Search Button */}
          <Button variant="ghost" size="icon" className="hidden lg:flex">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          {/* Quick Add Button */}
          <Button variant="ghost" size="icon">
            <Plus className="h-5 w-5" />
            <span className="sr-only">Quick add</span>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              2
            </Badge>
            <span className="sr-only">Notifications</span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    JD
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    john@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}