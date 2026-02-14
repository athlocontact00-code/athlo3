'use client';

import { motion } from 'framer-motion';
import { Sparkles, Wrench, Bug, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const versions = [
  {
    version: '1.2.0',
    date: 'February 14, 2025',
    isLatest: true,
    changes: [
      { type: 'feature', text: 'AI Coach now supports workout generation with periodization context' },
      { type: 'feature', text: 'Activity Feed — see what your team is training' },
      { type: 'feature', text: 'Personal Records tracking with celebration animations' },
      { type: 'improvement', text: 'Dashboard redesigned with Today focus view' },
      { type: 'improvement', text: 'Sleep analysis with stage breakdown and debt tracking' },
    ],
  },
  {
    version: '1.1.0',
    date: 'February 7, 2025',
    isLatest: false,
    changes: [
      { type: 'feature', text: 'Performance Management Chart (CTL/ATL/TSB)' },
      { type: 'feature', text: 'Power/Pace Duration Curve analysis' },
      { type: 'feature', text: 'Coach Plan Builder with periodization templates' },
      { type: 'improvement', text: 'Workout builder now supports repeat groups and intervals' },
      { type: 'fix', text: 'Calendar drag & drop on mobile devices' },
    ],
  },
  {
    version: '1.0.0',
    date: 'January 30, 2025',
    isLatest: false,
    changes: [
      { type: 'feature', text: 'ATHLO launch! 🇵🇱🚀' },
      { type: 'feature', text: 'Dashboard with readiness scoring and focus day' },
      { type: 'feature', text: 'Training calendar with monthly and weekly views' },
      { type: 'feature', text: 'Daily check-in system (HRV, sleep, stress, mood)' },
      { type: 'feature', text: 'AI Coach with explainable recommendations' },
      { type: 'feature', text: 'Team messaging with training context linking' },
      { type: 'feature', text: 'Stripe billing with Free/Pro/Coach/Team plans' },
    ],
  },
];

const typeConfig = {
  feature: { icon: Sparkles, label: 'New', className: 'bg-primary/20 text-primary' },
  improvement: { icon: Wrench, label: 'Improved', className: 'bg-blue-500/20 text-blue-400' },
  fix: { icon: Bug, label: 'Fixed', className: 'bg-amber-500/20 text-amber-400' },
};

export default function ChangelogPage() {
  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground mb-1">Changelog</h1>
        <p className="text-sm text-muted-foreground mb-8">What's new in ATHLO</p>
      </motion.div>

      <div className="space-y-8">
        {versions.map((version, vi) => (
          <motion.div
            key={version.version}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: vi * 0.1 }}
            className="relative"
          >
            {/* Version header */}
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-lg font-semibold text-foreground">v{version.version}</h2>
              {version.isLatest && (
                <Badge className="bg-primary/20 text-primary text-[10px]">Latest</Badge>
              )}
              <span className="text-xs text-muted-foreground">{version.date}</span>
            </div>

            {/* Changes */}
            <div className="space-y-2 pl-4 border-l-2 border-border/30">
              {version.changes.map((change, ci) => {
                const config = typeConfig[change.type as keyof typeof typeConfig];
                return (
                  <div key={ci} className="flex items-start gap-2.5 py-1">
                    <Badge variant="outline" className={`text-[9px] px-1.5 py-0 shrink-0 ${config.className} border-0`}>
                      {config.label}
                    </Badge>
                    <span className="text-sm text-foreground/80">{change.text}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
