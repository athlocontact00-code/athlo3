'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Confetti piece colors
const colors = [
  '#dc2626', // Polish red (primary)
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#3b82f6', // Blue
  '#8b5cf6', // Purple
  '#ec4899', // Pink
];

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  velocity: {
    x: number;
    y: number;
    rotation: number;
  };
  shape: 'square' | 'circle' | 'triangle';
}

interface ConfettiProps {
  trigger: boolean;
  duration?: number;
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

const generateConfettiPiece = (id: number, startX?: number, startY?: number): ConfettiPiece => {
  const shapes: ConfettiPiece['shape'][] = ['square', 'circle', 'triangle'];
  
  return {
    id,
    x: startX ?? Math.random() * window.innerWidth,
    y: startY ?? -20,
    rotation: Math.random() * 360,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: Math.random() * 8 + 4, // 4-12px
    velocity: {
      x: (Math.random() - 0.5) * 200, // -100 to 100
      y: Math.random() * 200 + 100, // 100-300 downward
      rotation: (Math.random() - 0.5) * 360, // -180 to 180 degrees/sec
    },
    shape: shapes[Math.floor(Math.random() * shapes.length)]
  };
};

const ConfettiPieceComponent = ({ piece, duration }: { piece: ConfettiPiece; duration: number }) => {
  const getShapeClass = (shape: ConfettiPiece['shape']) => {
    switch (shape) {
      case 'circle':
        return 'rounded-full';
      case 'triangle':
        return 'rotate-45';
      default:
        return '';
    }
  };

  return (
    <motion.div
      className={cn(
        "absolute pointer-events-none",
        getShapeClass(piece.shape)
      )}
      style={{
        backgroundColor: piece.color,
        width: piece.size,
        height: piece.size,
      }}
      initial={{
        x: piece.x,
        y: piece.y,
        rotate: piece.rotation,
        opacity: 1,
      }}
      animate={{
        x: piece.x + piece.velocity.x,
        y: piece.y + piece.velocity.y + window.innerHeight,
        rotate: piece.rotation + piece.velocity.rotation * (duration / 1000),
        opacity: [1, 1, 0.8, 0.6, 0],
      }}
      transition={{
        duration: duration / 1000,
        ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuad
      }}
    />
  );
};

export function Confetti({ 
  trigger, 
  duration = 2000, 
  intensity = 'medium',
  className 
}: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [isActive, setIsActive] = useState(false);

  const pieceCount = {
    low: 30,
    medium: 50,
    high: 80
  }[intensity];

  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true);
      
      // Generate confetti pieces
      const newPieces = Array.from({ length: pieceCount }, (_, i) => 
        generateConfettiPiece(Date.now() + i)
      );
      
      setPieces(newPieces);

      // Clear pieces after animation completes
      const timer = setTimeout(() => {
        setPieces([]);
        setIsActive(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [trigger, isActive, pieceCount, duration]);

  if (pieces.length === 0) return null;

  return (
    <div className={cn(
      "fixed inset-0 pointer-events-none z-50",
      className
    )}>
      <AnimatePresence>
        {pieces.map((piece) => (
          <ConfettiPieceComponent 
            key={piece.id} 
            piece={piece} 
            duration={duration}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Hook for triggering confetti
export function useConfetti() {
  const [trigger, setTrigger] = useState(false);

  const fire = () => {
    setTrigger(true);
    // Reset trigger after a short delay
    setTimeout(() => setTrigger(false), 100);
  };

  return { trigger, fire };
}

// Predefined confetti triggers
export const confettiTriggers = {
  newPR: () => ({ intensity: 'high' as const, duration: 3000 }),
  achievement: () => ({ intensity: 'medium' as const, duration: 2000 }),
  streak: () => ({ intensity: 'low' as const, duration: 1500 }),
};

// Usage examples:
// For new PR: const { trigger, fire } = useConfetti(); <Confetti trigger={trigger} {...confettiTriggers.newPR()} />
// For achievements: <Confetti trigger={trigger} {...confettiTriggers.achievement()} />
// For streaks: <Confetti trigger={trigger} {...confettiTriggers.streak()} />