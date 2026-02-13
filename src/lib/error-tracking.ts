/**
 * ATHLO Error Tracking
 * Sentry-ready abstraction. Logs to console when SENTRY_DSN is not set.
 */

interface ErrorTracker {
  captureException(error: Error, context?: Record<string, unknown>): void;
  captureMessage(message: string, level?: 'info' | 'warning' | 'error'): void;
  setUser(user: { id: string; email?: string; name?: string } | null): void;
}

class ConsoleErrorTracker implements ErrorTracker {
  captureException(error: Error, context?: Record<string, unknown>) {
    console.error('[ATHLO Error]', error.message, context);
  }

  captureMessage(message: string, level = 'info' as const) {
    console.log(`[ATHLO ${level.toUpperCase()}]`, message);
  }

  setUser(user: { id: string; email?: string; name?: string } | null) {
    if (user) {
      console.log('[ATHLO] User context set:', user.id);
    }
  }
}

// When Sentry is configured, replace this with Sentry SDK calls
export const errorTracker: ErrorTracker = new ConsoleErrorTracker();
