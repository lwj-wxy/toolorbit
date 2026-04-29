/**
 * Simple Analytics Service
 * 
 * In a real production environment, this would send data to:
 * - Google Analytics (GA4)
 * - Mixpanel
 * - Plausible
 * - Or a custom backend endpoint
 */

declare global {
  interface Window {
    gtag: (command: string, action: string, params?: any) => void;
  }
}

type AnalyticsEvent = {
  category: string;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
};

class AnalyticsService {
  private isEnabled: boolean = process.env.NODE_ENV === 'production';
  private debug: boolean = process.env.NODE_ENV !== 'production';
  private sessionId: string = '';
  private gaId: string = 'G-B7N9BGZ2B0';

  constructor() {
    this.sessionId = Math.random().toString(36).substring(2, 10);
  }

  init() {
    if (this.debug) {
      console.log(`📊 [Analytics] Initialized (Session: ${this.sessionId})`);
    }
  }

  // Track Page Views
  trackPageView(path: string) {
    if (!this.isEnabled) return;

    if (this.debug) {
      console.log(`📊 [Analytics] [Session: ${this.sessionId}] Page View: ${path}`);
    }

    if (typeof window.gtag === 'function') {
      window.gtag('config', this.gaId, {
        page_path: path,
        session_id: this.sessionId
      });
    }
  }

  // Track Custom Events
  trackEvent({ category, action, label, value, metadata }: AnalyticsEvent) {
    if (!this.isEnabled) return;

    if (this.debug) {
      console.log(`📊 [Analytics] [Session: ${this.sessionId}] Event: [${category}] ${action}`, {
        label,
        value,
        ...metadata,
      });
    }

    if (typeof window.gtag === 'function') {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
        session_id: this.sessionId,
        ...metadata,
      });
    }
  }

  // Set User Properties
  setUserProperties(properties: Record<string, any>) {
    if (!this.isEnabled) return;

    if (this.debug) {
      console.log('📊 [Analytics] Set User Properties:', properties);
    }

    if (typeof window.gtag === 'function') {
      window.gtag('set', 'user_properties', {
        ...properties,
        session_id: this.sessionId
      });
    }
  }

  disable() {
    this.isEnabled = false;
  }

  enable() {
    this.isEnabled = true;
  }
}

export const analytics = new AnalyticsService();
