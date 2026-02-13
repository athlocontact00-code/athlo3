'use client';

import { motion } from 'framer-motion';
import { Logo } from '@/components/common/logo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function CookiesPage() {
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
        <h1 className="text-3xl font-bold text-foreground mb-2">Cookie Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: February 2025</p>

        <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground">What Are Cookies</h2>
            <p>Cookies are small text files stored on your device when you visit ATHLO. They help us provide a better experience by remembering your preferences and keeping you logged in.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Essential Cookies</h2>
            <p>These are required for ATHLO to function:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong className="text-foreground">Session cookie</strong> — keeps you logged in</li>
              <li><strong className="text-foreground">CSRF token</strong> — protects against cross-site attacks</li>
              <li><strong className="text-foreground">Theme preference</strong> — remembers dark/light mode</li>
              <li><strong className="text-foreground">Language preference</strong> — remembers your language choice</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Functional Cookies</h2>
            <ul className="list-disc list-inside space-y-1">
              <li><strong className="text-foreground">PWA state</strong> — tracks install prompt status</li>
              <li><strong className="text-foreground">Sidebar state</strong> — remembers collapsed/expanded</li>
              <li><strong className="text-foreground">Calendar view</strong> — remembers preferred view (day/week/month)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Analytics Cookies</h2>
            <p>We may use anonymized analytics to understand how ATHLO is used. No personal data is shared with third parties for advertising. You can opt out in Settings → Privacy.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Third-Party Cookies</h2>
            <ul className="list-disc list-inside space-y-1">
              <li><strong className="text-foreground">Stripe</strong> — payment processing (PCI compliant)</li>
              <li><strong className="text-foreground">Vercel Analytics</strong> — performance monitoring (optional)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">Managing Cookies</h2>
            <p>You can clear cookies in your browser settings. Note that disabling essential cookies will prevent ATHLO from functioning properly.</p>
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
