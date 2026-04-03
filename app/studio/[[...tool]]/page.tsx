import { StudioClient } from "./studio-client";

/** Studio must not be fully static: config uses build-time env and schema should update after redeploys without stale CDN issues. */
export const dynamic = "force-dynamic";

export default function StudioPage() {
  return <StudioClient />;
}
