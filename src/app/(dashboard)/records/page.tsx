'use client';

import { motion } from 'framer-motion';
import { PersonalRecords } from '@/components/analytics/personal-records';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
};

export default function RecordsPage() {
  return (
    <div className="min-h-screen bg-background">
      <motion.div 
        className="max-w-7xl mx-auto p-4 md:p-6"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
      >
        <PersonalRecords />
      </motion.div>
    </div>
  );
}