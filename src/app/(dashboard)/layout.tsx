'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <Header />
          
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}