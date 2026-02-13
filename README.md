# ATHLO 🇵🇱

> Premium digital platform for endurance sports with coaching, social, and AI layers

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)](https://www.postgresql.org/)

## ✨ Features

ATHLO is a comprehensive platform designed for serious endurance athletes and coaches, featuring:

### 🎯 **Smart Training Management**
- **Workout Planning**: TrainingPeaks-level precision with AI-powered recommendations
- **Execution Tracking**: Real-time workout completion with compliance analysis
- **Template Library**: Extensive workout templates for all endurance sports

### ❤️ **Daily Readiness Monitoring**
- **HRV Tracking**: Heart Rate Variability analysis for recovery insights
- **Sleep Quality**: Comprehensive sleep tracking and scoring
- **Stress & Energy**: Daily check-ins with readiness score calculation
- **Recovery Recommendations**: AI-driven recovery and training adjustments

### 📅 **Central Training Calendar**
- **Unified View**: All workouts, events, and training phases in one place
- **Mobile-First**: Optimized day/week views for mobile training
- **Desktop Power**: Month view with detailed summaries for coaches
- **Smart Scheduling**: Conflict detection and automatic adjustments

### 📊 **Advanced Analytics**
- **Load Management**: CTL/ATL/TSB analysis with trend visualization
- **Performance Insights**: Explainable AI cards with actionable recommendations
- **Progress Tracking**: Long-term performance trends and goal monitoring
- **Comparative Analysis**: Benchmarking against similar athletes

### 💬 **Contextual Communication**
- **Team Messaging**: Coach-athlete and team communication
- **Workout Context**: Messages linked to specific workouts and training data
- **Group Features**: Team management with role-based permissions
- **Real-time Updates**: Instant notifications for important events

### 🤖 **AI-Powered Coaching**
- **Personal Assistant**: 24/7 AI coach for training questions
- **Workout Generation**: Automated workout creation based on goals
- **Micro-cycle Planning**: Intelligent training periodization
- **Explainable Insights**: Clear reasoning behind all recommendations

### 🔗 **Platform Integrations**
- **Strava**: Automatic activity import and sync
- **Garmin**: Direct integration with Garmin Connect
- **Apple Health**: iOS health and fitness data
- **Google Fit**: Android fitness tracking
- **Polar, Suunto, Wahoo**: Multi-platform device support

## 🏗️ Tech Stack

### **Frontend**
- **Next.js 15**: React framework with App Router
- **TypeScript**: Strict type safety throughout
- **Tailwind CSS**: Utility-first styling with custom design system
- **Framer Motion**: Smooth animations and micro-interactions
- **shadcn/ui**: Premium UI components

### **Backend**
- **Next.js API Routes**: Full-stack React framework
- **PostgreSQL**: Robust relational database
- **Drizzle ORM**: Type-safe database operations
- **NextAuth.js v5**: Secure authentication system

### **Infrastructure**
- **Vercel**: Deployment and hosting
- **AWS S3**: File storage for media uploads
- **Resend**: Transactional email service
- **OpenAI**: AI coaching and insights

### **Development**
- **ESLint**: Code linting and quality
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality gates
- **TypeScript**: Static type checking

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm/yarn/pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/athlocontact00-code/athlo.git
   cd athlo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your database and API keys
   ```

4. **Set up the database**
   ```bash
   # Run migrations
   npm run db:migrate
   
   # Seed development data (optional)
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Quick Start Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:generate  # Generate migrations
npm run db:migrate   # Run migrations
npm run db:studio    # Open Drizzle Studio

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
npm run format       # Format code with Prettier
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected dashboard pages
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Navigation and layout
│   ├── dashboard/        # Dashboard-specific components
│   ├── calendar/         # Calendar components
│   ├── diary/            # Check-in and diary components
│   ├── training/         # Workout components
│   ├── messages/         # Communication components
│   ├── ai-coach/         # AI coaching interface
│   └── common/           # Shared components
├── lib/                   # Utilities and configurations
│   ├── db/               # Database schema and connection
│   ├── auth/             # Authentication config
│   ├── utils.ts          # Utility functions
│   ├── constants.ts      # App constants
│   └── types.ts          # TypeScript types
└── hooks/                # Custom React hooks
```

## 🎨 Design System

ATHLO uses a premium dark theme inspired by WHOOP's aesthetic with Polish national colors:

- **Primary**: Polish Red (#dc2626) - CTAs and primary actions
- **Accent**: Polish White (#ffffff) - Text and highlights
- **Background**: Near-black gradients for premium feel
- **Cards**: Dark grays with subtle borders
- **Typography**: Inter font family for clarity

### Color Palette
```css
/* Polish National Colors */
--primary: #dc2626;        /* Polish Red */
--accent: #ffffff;         /* Polish White */

/* Dark Theme Base */
--background: #0f172a;     /* Deep background */
--card: #1e293b;           /* Card backgrounds */
--muted: #334155;          /* Muted elements */

/* Status Colors */
--success: #10b981;        /* Green */
--warning: #f59e0b;        /* Amber */
--info: #3b82f6;           /* Blue */
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## 🚢 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push

### Docker
```bash
# Build image
docker build -t athlo .

# Run container
docker run -p 3000:3000 athlo
```

### Manual Deployment
```bash
# Build production bundle
npm run build

# Start production server
npm start
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make changes and add tests
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Code Standards
- TypeScript strict mode
- ESLint configuration compliance
- Comprehensive testing (unit + integration)
- Mobile-first responsive design
- Accessibility (WCAG 2.1 AA)

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Polish engineering excellence 🇵🇱
- Open source community
- Endurance sports athletes worldwide
- Coach feedback and insights

## 📞 Support

- 📧 Email: support@athlo.com
- 💬 Discord: [Join our community](https://discord.gg/athlo)
- 📚 Documentation: [docs.athlo.com](https://docs.athlo.com)
- 🐛 Issues: [GitHub Issues](https://github.com/athlocontact00-code/athlo/issues)

---

**Built with ❤️ in Poland for athletes worldwide**

*ATHLO - Elevate Your Endurance*