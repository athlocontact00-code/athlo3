'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Quote as QuoteIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getQuoteOfTheDay, getRandomQuote, type Quote } from '@/lib/quotes';
import { cn } from '@/lib/utils';

interface QuoteOfDayProps {
  className?: string;
}

export function QuoteOfDay({ className }: QuoteOfDayProps) {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load quote of the day on mount
  useEffect(() => {
    setQuote(getQuoteOfTheDay());
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Add a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setQuote(getRandomQuote());
    setIsRefreshing(false);
  };

  if (!quote) {
    return (
      <Card className={cn("bg-card/50 backdrop-blur-sm border-border/50", className)}>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <div className="animate-pulse bg-muted rounded-md w-6 h-6" />
            <div className="flex-1 space-y-2">
              <div className="animate-pulse bg-muted rounded h-4 w-3/4" />
              <div className="animate-pulse bg-muted rounded h-3 w-1/2" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border-border/50",
      "hover:from-card/90 hover:to-card/70 transition-all duration-300",
      className
    )}>
      <CardContent className="p-6">
        <motion.div
          key={quote.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <QuoteIcon className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                Quote of the Day
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-8 w-8 p-0 hover:bg-muted/50"
            >
              <RefreshCw className={cn(
                "w-4 h-4 text-muted-foreground",
                isRefreshing && "animate-spin"
              )} />
            </Button>
          </div>

          {/* Quote Text */}
          <blockquote className="relative">
            <div className="absolute -top-2 -left-1 text-4xl text-primary/20 font-serif">
              "
            </div>
            <p className="italic text-foreground/90 font-medium leading-relaxed pl-6">
              {quote.text}
            </p>
          </blockquote>

          {/* Author */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">
                — {quote.author}
              </p>
              <div className="flex items-center justify-end space-x-2 mt-1">
                <span className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                  "bg-primary/10 text-primary"
                )}>
                  {quote.category.replace('-', ' ')}
                </span>
                <span className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                  quote.language === 'pl' 
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                )}>
                  {quote.language === 'pl' ? '🇵🇱' : '🇺🇸'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}