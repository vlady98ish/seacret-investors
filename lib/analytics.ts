import type { PostHog } from "posthog-js";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    posthog?: PostHog;
  }
}

export function trackEvent(
  eventName: string,
  properties?: Record<string, string | number | boolean | undefined>
): void {
  // Push to GTM dataLayer
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({ event: eventName, ...properties });
  }

  // Send to PostHog
  if (typeof window !== "undefined" && window.posthog) {
    window.posthog.capture(eventName, properties);
  }
}
