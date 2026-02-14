'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NumberTickerProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  delay?: number;
  easing?: 'linear' | 'easeOut' | 'easeInOut' | 'bounce';
}

// Easing functions
const easingFunctions = {
  linear: (t: number) => t,
  easeOut: (t: number) => 1 - Math.pow(1 - t, 3),
  easeInOut: (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  bounce: (t: number) => {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    } else if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    } else {
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    }
  },
};

export function NumberTicker({
  value,
  duration = 500,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
  delay = 0,
  easing = 'easeOut'
}: NumberTickerProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const startValueRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  const animate = (currentTime: number) => {
    if (startTimeRef.current === null) {
      startTimeRef.current = currentTime;
    }

    const elapsed = currentTime - startTimeRef.current - delay;
    
    if (elapsed < 0) {
      // Still in delay period
      animationFrameRef.current = requestAnimationFrame(animate);
      return;
    }

    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easingFunctions[easing](progress);
    
    const currentValue = startValueRef.current + (value - startValueRef.current) * easedProgress;
    setDisplayValue(currentValue);

    if (progress < 1) {
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      setIsAnimating(false);
      startTimeRef.current = null;
    }
  };

  useEffect(() => {
    if (value !== displayValue && !isAnimating) {
      setIsAnimating(true);
      startValueRef.current = displayValue;
      startTimeRef.current = null;
      
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [value]); // Only depend on value to avoid infinite re-renders

  // Format the display value
  const formatValue = (num: number) => {
    return num.toFixed(decimals);
  };

  return (
    <motion.span 
      className={cn("font-mono tabular-nums", className)}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {prefix}
      {formatValue(displayValue)}
      {suffix}
    </motion.span>
  );
}

// Specialized number tickers for common use cases
export function PercentageTicker({ 
  value, 
  className, 
  ...props 
}: Omit<NumberTickerProps, 'suffix' | 'decimals'> & { className?: string }) {
  return (
    <NumberTicker
      value={value}
      suffix="%"
      decimals={0}
      className={className}
      {...props}
    />
  );
}

export function ScoreTicker({ 
  value, 
  maxValue = 100, 
  className, 
  ...props 
}: Omit<NumberTickerProps, 'suffix' | 'decimals'> & { 
  maxValue?: number;
  className?: string;
}) {
  return (
    <div className="flex items-center space-x-2">
      <NumberTicker
        value={value}
        decimals={0}
        className={cn("text-4xl font-bold", className)}
        {...props}
      />
      <span className="text-lg text-muted-foreground">
        / {maxValue}
      </span>
    </div>
  );
}

export function PowerTicker({ 
  value, 
  className, 
  ...props 
}: Omit<NumberTickerProps, 'suffix' | 'decimals'> & { className?: string }) {
  return (
    <NumberTicker
      value={value}
      suffix="W"
      decimals={0}
      className={className}
      {...props}
    />
  );
}

export function HeartRateTicker({ 
  value, 
  className, 
  ...props 
}: Omit<NumberTickerProps, 'suffix' | 'decimals'> & { className?: string }) {
  return (
    <NumberTicker
      value={value}
      suffix=" bpm"
      decimals={0}
      className={className}
      {...props}
    />
  );
}

export function DistanceTicker({ 
  value, 
  unit = 'km', 
  className, 
  ...props 
}: Omit<NumberTickerProps, 'suffix' | 'decimals'> & { 
  unit?: string;
  className?: string;
}) {
  const decimals = unit === 'km' ? 1 : 0;
  
  return (
    <NumberTicker
      value={value}
      suffix={` ${unit}`}
      decimals={decimals}
      className={className}
      {...props}
    />
  );
}

// Usage examples:
// <NumberTicker value={readinessScore} duration={1000} className="text-4xl font-bold text-green-500" />
// <PercentageTicker value={compliance} duration={800} delay={200} />
// <ScoreTicker value={75} maxValue={100} />
// <PowerTicker value={265} />
// <HeartRateTicker value={165} />
// <DistanceTicker value={42.2} unit="km" />