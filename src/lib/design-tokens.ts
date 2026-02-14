/**
 * ATHLO Design System Tokens
 * Premium design system inspired by Apple, Spotify, WHOOP, Linear, Arc Browser
 * 🇵🇱 Polish pride - Dark & Red DNA
 */

// Spacing Scale - Perfect 8px grid system
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  '4xl': '40px',
  '5xl': '48px',
  '6xl': '64px',
} as const;

// Border Radius - Consistent rounded corners
export const borderRadius = {
  sm: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
} as const;

// Shadow System - Subtle depth with red glow highlights
export const shadows = {
  subtle: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  default: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  medium: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  large: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  glow: '0 0 0 1px rgb(239 68 68 / 0.2), 0 4px 16px rgb(239 68 68 / 0.12)',
} as const;

// Animation Durations - Smooth, premium feel
export const duration = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
  page: '700ms',
} as const;

// Easing Functions
export const easing = {
  ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// Chart Colors - Multi-line chart palette
export const chartColors = {
  primary: '#ef4444', // Red - ATHLO brand
  fitness: '#3b82f6', // Blue - fitness metrics
  fatigue: '#f97316', // Orange - fatigue/stress
  form: '#10b981', // Green - form/recovery
  performance: '#8b5cf6', // Purple - performance
  amber: '#f59e0b', // Amber - warnings
} as const;

// Typography Scale - Perfect readability hierarchy
export const typography = {
  // Display
  display: {
    fontSize: '3.75rem', // 60px
    lineHeight: '1',
    fontWeight: '900',
    letterSpacing: '-0.025em',
  },
  // Headings
  h1: {
    fontSize: '2.25rem', // 36px
    lineHeight: '2.5rem',
    fontWeight: '700',
    letterSpacing: '-0.025em',
  },
  h2: {
    fontSize: '1.875rem', // 30px
    lineHeight: '2.25rem',
    fontWeight: '600',
    letterSpacing: '-0.025em',
  },
  h3: {
    fontSize: '1.5rem', // 24px
    lineHeight: '2rem',
    fontWeight: '600',
    letterSpacing: '-0.025em',
  },
  h4: {
    fontSize: '1.25rem', // 20px
    lineHeight: '1.75rem',
    fontWeight: '600',
  },
  h5: {
    fontSize: '1.125rem', // 18px
    lineHeight: '1.75rem',
    fontWeight: '600',
  },
  h6: {
    fontSize: '1rem', // 16px
    lineHeight: '1.5rem',
    fontWeight: '600',
  },
  // Body Text
  body: {
    fontSize: '0.875rem', // 14px
    lineHeight: '1.25rem',
    fontWeight: '400',
  },
  bodyLarge: {
    fontSize: '1rem', // 16px
    lineHeight: '1.5rem',
    fontWeight: '400',
  },
  // Small Text
  small: {
    fontSize: '0.75rem', // 12px
    lineHeight: '1rem',
    fontWeight: '400',
  },
  // Labels
  label: {
    fontSize: '0.875rem', // 14px
    lineHeight: '1.25rem',
    fontWeight: '500',
  },
  // Caption
  caption: {
    fontSize: '0.75rem', // 12px
    lineHeight: '1rem',
    fontWeight: '400',
    letterSpacing: '0.025em',
  },
  // Code
  code: {
    fontSize: '0.875rem', // 14px
    lineHeight: '1.25rem',
    fontWeight: '400',
    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
  },
} as const;

// Z-Index Scale - Layering system
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// Layout Breakpoints - Mobile-first responsive
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Component Sizes - Consistent sizing system
export const componentSizes = {
  icon: {
    xs: '12px',
    sm: '16px',
    md: '20px',
    lg: '24px',
    xl: '32px',
  },
  button: {
    sm: '32px',
    md: '40px',
    lg: '48px',
    xl: '56px',
  },
  input: {
    sm: '32px',
    md: '40px',
    lg: '48px',
  },
  avatar: {
    xs: '24px',
    sm: '32px',
    md: '40px',
    lg: '48px',
    xl: '64px',
  },
} as const;

// Utility Functions
export const getSpacing = (size: keyof typeof spacing) => spacing[size];
export const getBorderRadius = (size: keyof typeof borderRadius) => borderRadius[size];
export const getShadow = (size: keyof typeof shadows) => shadows[size];
export const getDuration = (speed: keyof typeof duration) => duration[speed];
export const getChartColor = (type: keyof typeof chartColors) => chartColors[type];

// Type Exports
export type SpacingSize = keyof typeof spacing;
export type BorderRadiusSize = keyof typeof borderRadius;
export type ShadowSize = keyof typeof shadows;
export type DurationSpeed = keyof typeof duration;
export type ChartColorType = keyof typeof chartColors;
export type TypographySize = keyof typeof typography;
export type ComponentSizeType = keyof typeof componentSizes;