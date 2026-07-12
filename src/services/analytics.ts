import { getGaMeasurementId } from '../lib/analytics-config';

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
    dataLayer?: Array<GtagCommand | IArguments | Record<string, unknown>>;
    gtag?: (...args: GtagCommand) => void;
  }
}

type GtagCommand = [string, ...unknown[]];

type AnalyticsEvent = {
  category: string;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
};

const normalizeEventName = (action: string) => {
  const normalizedAction = action
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 40);

  return normalizedAction || 'toolorbit_event';
};

class AnalyticsService {
  private isEnabled: boolean = false;
  private debug: boolean = process.env.NODE_ENV !== 'production';
  private sessionId: string = '';
  private gaId: string = getGaMeasurementId();

  constructor() {
    this.sessionId = Math.random().toString(36).substring(2, 10);
  }

  private sendGtag(command: string, ...args: unknown[]) {
    if (!this.gaId || typeof window === 'undefined') return;

    const gtagCommand = [command, ...args] as GtagCommand;

    if (typeof window.gtag === 'function') {
      window.gtag(...gtagCommand);
      return;
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(gtagCommand);
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

    this.sendGtag('config', this.gaId, {
      page_path: path,
      session_id: this.sessionId
    });
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

    this.sendGtag('event', normalizeEventName(action), {
      event_category: category,
      event_label: label,
      value: value,
      session_id: this.sessionId,
      ...metadata,
    });
  }

  // Set User Properties
  setUserProperties(properties: Record<string, any>) {
    if (!this.isEnabled) return;

    if (this.debug) {
      console.log('📊 [Analytics] Set User Properties:', properties);
    }

    this.sendGtag('set', 'user_properties', {
      ...properties,
      session_id: this.sessionId
    });
  }

  disable() {
    this.isEnabled = false;
  }

  enable() {
    this.isEnabled = true;
  }
}

export const analytics = new AnalyticsService();
