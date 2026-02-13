'use client';

import { motion } from 'framer-motion';
import { Logo } from '@/components/common/logo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold text-foreground mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: February 2025</p>

        <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p>By accessing or using ATHLO ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">2. Account Registration</h2>
            <p>You must provide accurate information when creating an account. You are responsible for maintaining the security of your account credentials. You must be at least 16 years old to use ATHLO.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">3. Subscriptions & Billing</h2>
            <p>ATHLO offers Free, Pro, Coach, and Team subscription plans. Paid subscriptions are billed monthly via Stripe. You may cancel at any time; access continues until the end of the billing period. Refunds are handled on a case-by-case basis.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">4. User Data & Privacy</h2>
            <p>Your training data, health metrics, and personal information are governed by our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>. You retain ownership of your data and may export or delete it at any time.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">5. AI Coach Disclaimer</h2>
            <p>ATHLO's AI Coach provides training suggestions based on your data. These are not medical advice. Always consult a healthcare professional before making significant changes to your training or health regimen. AI recommendations are provided "as is" without guarantees of accuracy.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">6. Acceptable Use</h2>
            <p>You agree not to: reverse engineer the Platform, share your account, upload malicious content, or use ATHLO for any unlawful purpose. We reserve the right to suspend accounts that violate these terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">7. Intellectual Property</h2>
            <p>ATHLO, its design, code, and branding are the intellectual property of ATHLO. Your training data belongs to you. Content you share in groups or public areas may be visible to other users.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">8. Termination</h2>
            <p>You may delete your account at any time via Settings. We may terminate accounts that violate these terms with notice. Upon termination, your data will be deleted within 30 days unless legally required to retain it.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">9. Limitation of Liability</h2>
            <p>ATHLO is provided "as is". We are not liable for injuries, training outcomes, or decisions made based on AI recommendations. Use the Platform at your own risk.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">10. Governing Law</h2>
            <p>These terms are governed by the laws of Poland. Any disputes shall be resolved in the courts of Warsaw, Poland.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">11. Contact</h2>
            <p>Questions? Email us at <span className="text-primary">legal@athlo.app</span> or visit our <Link href="/contact" className="text-primary hover:underline">Contact page</Link>.</p>
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
