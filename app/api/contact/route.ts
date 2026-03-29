import { NextResponse } from "next/server";
import { z } from "zod";

import { sanityWriteClient } from "@/lib/sanity/client";

const payloadSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  interest: z.string().min(1),
  message: z.string().optional(),
  locale: z.string().min(2),
  source: z.string().optional(),
  preferredVilla: z.string().optional(),
  budget: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  gdprConsent: z.literal(true, { errorMap: () => ({ message: "GDPR consent is required" }) }),
  turnstileToken: z.string().optional(),
});

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token }),
  });

  const data = (await response.json()) as { success: boolean };
  return data.success;
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = payloadSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { ok: false, message: "Please complete the form correctly." },
      { status: 400 }
    );
  }

  const data = result.data;

  if (data.turnstileToken) {
    const valid = await verifyTurnstile(data.turnstileToken);
    if (!valid) {
      return NextResponse.json(
        { ok: false, message: "Spam verification failed. Please try again." },
        { status: 403 }
      );
    }
  }

  try {
    await sanityWriteClient.create({
      _type: "leadSubmission",
      fullName: data.fullName,
      email: data.email,
      phone: data.phone ?? "",
      interest: data.interest,
      message: data.message ?? "",
      locale: data.locale,
      source: data.source ?? "",
      preferredVilla: data.preferredVilla ?? "",
      budget: data.budget ?? "",
      utmSource: data.utmSource ?? "",
      utmMedium: data.utmMedium ?? "",
      utmCampaign: data.utmCampaign ?? "",
      gdprConsent: data.gdprConsent,
    });
  } catch (error) {
    console.error("Failed to write lead to Sanity:", error);
  }

  console.log("Lead received:", data.fullName, data.email, data.interest);

  return NextResponse.json({
    ok: true,
    message: "Thank you! We'll be in touch within 24 hours.",
  });
}
