import { NextResponse } from "next/server";

import { sanityWriteClient } from "@/lib/sanity/client";

export async function PATCH(request: Request) {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not allowed in production" }, { status: 403 });
  }

  const { plotId, x, y } = await request.json();

  if (!plotId || x == null || y == null) {
    return NextResponse.json({ error: "Missing plotId, x, or y" }, { status: 400 });
  }

  await sanityWriteClient
    .patch(plotId)
    .set({ positionData: { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 } })
    .commit();

  return NextResponse.json({ ok: true, plotId, x, y });
}
