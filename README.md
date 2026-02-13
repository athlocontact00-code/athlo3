<div align="center">

# 🏆 ATHLO

### Your Sport. Your Platform.

**The premium universal sports platform with coaching, AI, and social layers.**

Built with ❤️ in Poland 🇵🇱

[Live Demo](https://athlo.vercel.app) · [Report Bug](https://github.com/athlocontact00-code/athlo3/issues)

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![Drizzle](https://img.shields.io/badge/Drizzle-ORM-green)
![Neon](https://img.shields.io/badge/Neon-Postgres-00e699)
![Stripe](https://img.shields.io/badge/Stripe-Billing-635bff?logo=stripe)
![Vercel](https://img.shields.io/badge/Vercel-Deploy-black?logo=vercel)
![PWA](https://img.shields.io/badge/PWA-Ready-blue)
![Capacitor](https://img.shields.io/badge/Capacitor-Mobile-119EFF)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎯 **Smart Training Plans** | Create, track, and compare plan vs execution with compliance tracking |
| 📊 **Advanced Analytics** | CTL/ATL/TSB analysis, training load, race predictions, season comparison |
| 📋 **Daily Check-ins** | HRV, sleep, stress, mood, DOMS, readiness — your daily health ritual |
| 💬 **Team Messaging** | Coach-athlete DMs and group chat, linked to training context |
| 🤖 **AI Coach** | Intelligent recommendations with full explainability and chat history |
| 📅 **Central Calendar** | Monthly/weekly views with workout events, rest days, and race markers |
| 🏆 **Gamification** | Streaks, badges, milestones with celebration animations |
| 💳 **Subscription Billing** | Stripe-powered plans: Free / Pro / Coach / Team |
| 📱 **PWA + Mobile** | Install anywhere, offline support, Capacitor for iOS/Android |
| 🌍 **Multi-language** | Polish, English, German (i18n ready) |
| 🎨 **Premium Design** | WHOOP-level dark theme with Framer Motion micro-animations |
| ⌨️ **Command Palette** | Cmd+K quick navigation and search |
| 🛡️ **GDPR Compliant** | Data export, account deletion, privacy controls |

## 🏅 Supported Sports

Every sport. Every athlete.

🏃 Running · 🚴 Cycling · 🏊 Swimming · ⚽ Football · 🏀 Basketball · 🏋️ CrossFit · 💪 HYROX · 🥊 MMA · 🎾 Tennis · 🧘 Yoga · 🏈 Rugby · ⛷️ Skiing · 🏐 Volleyball · 🏓 Table Tennis · 🤸 Gymnastics · And more...

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/athlocontact00-code/athlo3.git
cd athlo3

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your keys (Neon, Stripe, OpenAI, etc.)

# Run database migrations
npx drizzle-kit push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🚀

## 🗄️ Database

ATHLO uses **Neon** (serverless PostgreSQL) with **Drizzle ORM**.

```bash
# Generate migrations
npx drizzle-kit generate

# Push schema to database
npx drizzle-kit push

# Open Drizzle Studio
npx drizzle-kit studio
```

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Login, Register
│   ├── (dashboard)/              # All dashboard pages
│   │   ├── calendar/             # Training calendar
│   │   ├── diary/                # Daily check-ins
│   │   ├── plan/                 # Training plans
│   │   ├── progress/             # Analytics & progress
│   │   ├── messages/             # Team messaging
│   │   ├── ai-coach/             # AI Coach chat
│   │   ├── billing/              # Subscription management
│   │   ├── settings/             # User settings
│   │   └── onboarding/           # New user onboarding
│   ├── (marketing)/              # Landing, Pricing, About, Legal
│   ├── api/                      # API routes
│   └── api-docs/                 # API documentation
├── components/                   # React components
│   ├── ui/                       # shadcn/ui primitives
│   ├── layout/                   # Sidebar, Header, Nav
│   ├── dashboard/                # Dashboard widgets
│   ├── calendar/                 # Calendar components
│   ├── diary/                    # Check-in components
│   ├── training/                 # Workout components
│   ├── messages/                 # Chat components
│   ├── ai-coach/                 # AI Coach components
│   ├── analytics/                # Charts & analytics
│   ├── health/                   # Health metrics
│   ├── coaching/                 # Coach tools
│   ├── billing/                  # Billing components
│   └── common/                   # Shared components
├── lib/                          # Core utilities
│   ├── db/                       # Drizzle schema & connection
│   ├── ai/                       # AI provider abstraction
│   ├── i18n/                     # Internationalization
│   ├── stripe.ts                 # Stripe integration
│   └── pwa.ts                    # PWA utilities
└── hooks/                        # React hooks
```

## 🚢 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/athlocontact00-code/athlo3)

1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy — automatically uses Warsaw region (waw1)

## 📱 Mobile (Capacitor)

```bash
# Build for mobile
npm run build
npx cap sync

# Open in Xcode (iOS)
npx cap open ios

# Open in Android Studio
npx cap open android
```

## 🔑 Environment Variables

See `.env.example` for the full list. Key variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `NEXTAUTH_SECRET` | NextAuth.js secret |
| `OPENAI_API_KEY` | OpenAI API key for AI Coach |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License

MIT © 2025 ATHLO

---

<div align="center">

**Built with ❤️ in Poland 🇵🇱**

*ATHLO — Where every athlete finds their edge.*

</div>
