"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function VillaViewTracker({ villaName, villaSlug }: { villaName: string; villaSlug: string }) {
  useEffect(() => {
    trackEvent("villa_view", { villa_name: villaName, villa_slug: villaSlug });
  }, [villaName, villaSlug]);

  return null;
}
