"use client";

import { useState, useEffect } from "react";
import { getConsent } from "./cookie-consent";
import { GoogleTagManager } from "./google-tag-manager";
import { PostHogProvider } from "./posthog-provider";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<boolean | null>(null);

  useEffect(() => {
    setConsent(getConsent());

    function onStorage() {
      setConsent(getConsent());
    }

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <>
      {consent === true && (
        <>
          <GoogleTagManager />
          <PostHogProvider>{children}</PostHogProvider>
        </>
      )}
      {consent !== true && children}
    </>
  );
}
