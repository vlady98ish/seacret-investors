import posthog from "posthog-js";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function trackEvent(
  eventName: string,
  properties?: Record<string, string | number | boolean | undefined>
): void {
  if (typeof window === "undefined") return;

  // Push to GTM dataLayer
  if (window.dataLayer) {
    window.dataLayer.push({ event: eventName, ...properties });
  }

  // Send to PostHog (no-op if not initialized)
  if (posthog.__loaded) {
    posthog.capture(eventName, properties);
  }
}
