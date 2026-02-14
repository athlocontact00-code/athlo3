'use client';

import { motion } from 'framer-motion';
import { Share2, Copy, Instagram, Twitter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShareCardProps {
  type: 'workout' | 'achievement';
  title: string;
  subtitle?: string;
  metrics?: { label: string; value: string }[];
  badge?: string;
}

export function ShareCard({ type, title, subtitle, metrics = [], badge }: ShareCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-4"
    >
      {/* Preview Card */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-red-950/30 border border-border/30 rounded-2xl p-6 overflow-hidden">
        {/* ATHLO watermark */}
        <div className="absolute top-3 right-3 text-[10px] font-bold text-white/20 tracking-widest">ATHLO</div>

        {badge && (
          <div className="inline-flex items-center bg-primary/20 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full mb-3">
            {badge}
          </div>
        )}

        <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
        {subtitle && <p className="text-sm text-white/60 mb-4">{subtitle}</p>}

        {metrics.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {metrics.map((m) => (
              <div key={m.label} className="text-center">
                <div className="text-lg font-bold text-white">{m.value}</div>
                <div className="text-[10px] text-white/40 uppercase tracking-wider">{m.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom bar */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 bg-primary rounded flex items-center justify-center">
              <span className="text-[8px] font-black text-white">A</span>
            </div>
            <span className="text-[10px] text-white/40">athlo.app</span>
          </div>
          <span className="text-[10px] text-white/30">🇵🇱</span>
        </div>
      </div>

      {/* Share Actions */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="flex-1 text-xs">
          <Copy className="w-3 h-3 mr-1.5" /> Copy
        </Button>
        <Button variant="outline" size="sm" className="flex-1 text-xs">
          <Download className="w-3 h-3 mr-1.5" /> Save
        </Button>
        <Button variant="outline" size="sm" className="flex-1 text-xs">
          <Share2 className="w-3 h-3 mr-1.5" /> Share
        </Button>
      </div>
    </motion.div>
  );
}
