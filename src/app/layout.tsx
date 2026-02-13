import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PWAInitializer } from "@/components/pwa/pwa-initializer";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "ATHLO - Universal Sports Platform",
    template: "%s | ATHLO"
  },
  description: "Universal sports platform for every sport and every athlete. Advanced coaching tools, social features, and AI insights designed for serious athletes and coaches.",
  keywords: [
    "sports", "training", "coaching", "fitness", "athletics", "performance",
    "workout", "AI coach", "progress tracking", "team management", "Poland",
    "football", "crossfit", "running", "cycling", "triathlon", "MMA", "HYROX"
  ],
  authors: [{ name: "ATHLO Team", url: "https://athlo.com" }],
  creator: "ATHLO",
  publisher: "ATHLO",
  
  // PWA & Mobile
  applicationName: "ATHLO",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ATHLO",
    startupImage: [
      {
        url: "/splash/launch-640x1136.png",
        media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)"
      },
      {
        url: "/splash/launch-750x1334.png", 
        media: "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"
      }
    ]
  },
  
  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://athlo.com",
    siteName: "ATHLO",
    title: "ATHLO - Universal Sports Platform",
    description: "Universal sports platform for every sport and every athlete",
    images: [
      {
        url: "/og/og-image.png",
        width: 1200,
        height: 630,
        alt: "ATHLO - Universal Sports Platform"
      }
    ]
  },
  
  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "ATHLO - Universal Sports Platform",
    description: "Universal sports platform for every sport and every athlete",
    images: ["/og/twitter-card.png"],
    creator: "@athlo_app"
  },
  
  // Verification
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code"
  },
  
  // Other
  category: "Sports & Fitness",
  classification: "Sports Training Platform",
  
  // Icons
  icons: {
    icon: [
      { url: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icons/icon-512.svg", sizes: "512x512", type: "image/svg+xml" }
    ],
    apple: [
      { url: "/icons/apple-touch-icon-180.png", sizes: "180x180", type: "image/png" }
    ],
    other: [
      { rel: "mask-icon", url: "/icons/safari-pinned-tab.svg", color: "#dc2626" }
    ]
  },
  
  // Manifest
  manifest: "/manifest.json",
  
  // Other meta tags
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "msapplication-TileColor": "#dc2626",
    "msapplication-config": "/browserconfig.xml"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#dc2626",
  colorScheme: "dark light"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className="dark">
      <head>
        {/* Additional PWA meta tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ATHLO" />
        <meta name="msapplication-TileImage" content="/icons/icon-192.png" />
        <meta name="msapplication-TileColor" content="#dc2626" />
        <meta name="msapplication-navbutton-color" content="#dc2626" />
        <meta name="msapplication-starturl" content="/dashboard" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for likely external requests */}
        <link rel="dns-prefetch" href="//api.strava.com" />
        <link rel="dns-prefetch" href="//connect.garmin.com" />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        {/* PWA Initializer - handles service worker registration */}
        <PWAInitializer />
        
        {/* Main app content */}
        <div id="app" className="min-h-screen">
          {children}
        </div>
        
        {/* Toast notifications */}
        <Toaster 
          position="top-right"
          theme="dark"
          richColors
          closeButton
          duration={3000}
        />
        
        {/* Install prompt and update notifications will be handled by PWA components */}
        <div id="pwa-prompts" />
      </body>
    </html>
  );
}
