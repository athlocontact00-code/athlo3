'use client';

import { motion } from 'framer-motion';
import { Logo } from '@/components/common/logo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="sm" />
          <Link href="/"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Back</Button></Link>
        </div>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 py-12"
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: February 2025 · GDPR Compliant</p>

        <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground">1. Data Controller</h2>
            <p>ATHLO, based in Warsaw, Poland, is the data controller for your personal data. Contact: <span className="text-primary">privacy@athlo.app</span></p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">2. Data We Collect</h2>
            <ul className="list-disc list-inside space-y-1">
              <li><strong className="text-foreground">Account data:</strong> name, email, password (hashed)</li>
              <li><strong className="text-foreground">Profile data:</strong> sport disciplines, training zones, goals</li>
              <li><strong className="text-foreground">Training data:</strong> workouts, plans, calendar events</li>
              <li><strong className="text-foreground">Health data:</strong> HRV, sleep, stress, mood, weight, readiness</li>
              <li><strong className="text-foreground">Communication:</strong> messages between athletes and coaches</li>
              <li><strong className="text-foreground">AI interactions:</strong> conversations with AI Coach</li>
              <li><strong className="text-foreground">Usage data:</strong> page views, feature usage (anonymized)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">3. How We Use Your Data</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Providing and personalizing the ATHLO platform</li>
              <li>Generating AI Coach recommendations based on your training context</li>
              <li>Analyzing training load, progress, and injury risk</li>
              <li>Facilitating communication between coaches and athletes</li>
              <li>Processing subscription payments via Stripe</li>
              <li>Sending training reminders and weekly digests (with consent)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">4. Data Storage & Processing</h2>
            <ul className="list-disc list-inside space-y-1">
              <li><strong className="text-foreground">Database:</strong> Neon (serverless PostgreSQL), EU region</li>
              <li><strong className="text-foreground">Hosting:</strong> Vercel, Warsaw region (waw1)</li>
              <li><strong className="text-foreground">Payments:</strong> Stripe (PCI-DSS compliant)</li>
              <li><strong className="text-foreground">AI Processing:</strong> OpenAI API (data not used for model training)</li>
              <li><strong className="text-foreground">Integrations:</strong> Strava, Garmin, Apple Health, Google Fit (authorized by you)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">5. Your Rights (GDPR)</h2>
            <p>Under GDPR, you have the right to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong className="text-foreground">Access</strong> — view all data we hold about you</li>
              <li><strong className="text-foreground">Export</strong> — download your data in JSON format</li>
              <li><strong className="text-foreground">Rectification</strong> — correct inaccurate data</li>
              <li><strong className="text-foreground">Deletion</strong> — permanently delete your account and data</li>
              <li><strong className="text-foreground">Portability</strong> — transfer your data to another service</li>
              <li><strong className="text-foreground">Objection</strong> — opt out of non-essential processing</li>
            </ul>
            <p className="mt-2">Exercise these rights via Settings → Account or email <span className="text-primary">privacy@athlo.app</span>.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">6. Data Retention</h2>
            <p>We retain your data while your account is active. Upon deletion, all personal data is removed within 30 days. Anonymized analytics may be retained. Billing records are kept as required by Polish tax law.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">7. Cookies</h2>
            <p>We use essential cookies for authentication and preferences. See our <Link href="/cookies" className="text-primary hover:underline">Cookie Policy</Link> for details.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">8. Changes to This Policy</h2>
            <p>We will notify you of significant changes via email or in-app notification. Continued use after changes constitutes acceptance.</p>
          </section>
        </div>
      </motion.div>

      <footer className="border-t border-border py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2025 ATHLO. Built with ❤️ in Poland 🇵🇱
        </div>
      </footer>
    </div>
  );
}
