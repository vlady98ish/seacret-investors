import { NextResponse } from "next/server";
import { Resend } from "resend";
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

  // Send email notification
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "Sea'cret Residences <onboarding@resend.dev>",
        to: "office@livebettergr.com",
        subject: `New inquiry from ${data.fullName}`,
        html: `
          <h2>New Lead Submission</h2>
          <table style="border-collapse:collapse;width:100%;max-width:600px;">
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Name</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.fullName}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Email</td><td style="padding:8px;border-bottom:1px solid #eee;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
            ${data.phone ? `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Phone</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.phone}</td></tr>` : ""}
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Interest</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.interest}</td></tr>
            ${data.preferredVilla ? `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Preferred Villa</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.preferredVilla}</td></tr>` : ""}
            ${data.budget ? `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Budget</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.budget}</td></tr>` : ""}
            ${data.message ? `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Message</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.message}</td></tr>` : ""}
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Locale</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.locale}</td></tr>
            ${data.source ? `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Source</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.source}</td></tr>` : ""}
            ${data.utmSource ? `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">UTM</td><td style="padding:8px;border-bottom:1px solid #eee;">${data.utmSource} / ${data.utmMedium} / ${data.utmCampaign}</td></tr>` : ""}
          </table>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError);
      // Don't fail the API response — Sanity write already succeeded
    }
  }

  console.log("Lead received:", data.fullName, data.email, data.interest);

  return NextResponse.json({
    ok: true,
    message: "Thank you! We'll be in touch within 24 hours.",
  });
}
