import { NextResponse } from "next/server";

import { sanityWriteClient } from "@/lib/sanity/client";

export async function PATCH(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not allowed in production" }, { status: 403 });
  }

  const { plotId, unitId, x, y, width, height, floorIndex } = await request.json();

  if (!plotId || !unitId || x == null || y == null || width == null || height == null) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const round = (n: number) => Math.round(n * 10) / 10;

  // Fetch current unitPositions array
  const plot = await sanityWriteClient.fetch<{
    unitPositions?: Array<{
      _key: string;
      unit: { _ref: string };
      floorIndex: number;
      x: number;
      y: number;
      width: number;
      height: number;
    }>;
  }>(
    `*[_type == "plot" && _id == $plotId][0]{ unitPositions }`,
    { plotId },
  );

  const positions = plot?.unitPositions ?? [];
  const existingIndex = positions.findIndex(
    (p) => p.unit?._ref === unitId && (p.floorIndex ?? 0) === (floorIndex ?? 0),
  );

  const entry = {
    _key: existingIndex >= 0 ? positions[existingIndex]._key : `${unitId.slice(-6)}-${floorIndex ?? 0}`,
    unit: { _type: "reference" as const, _ref: unitId },
    floorIndex: floorIndex ?? 0,
    x: round(x),
    y: round(y),
    width: round(width),
    height: round(height),
  };

  if (existingIndex >= 0) {
    await sanityWriteClient
      .patch(plotId)
      .set({ [`unitPositions[${existingIndex}]`]: entry })
      .commit();
  } else {
    await sanityWriteClient
      .patch(plotId)
      .setIfMissing({ unitPositions: [] })
      .append("unitPositions", [entry])
      .commit();
  }

  return NextResponse.json({ ok: true });
}
