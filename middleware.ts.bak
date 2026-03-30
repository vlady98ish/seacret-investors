import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "he", "ru", "el"];
const defaultLocale = "en";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Detect preferred locale from Accept-Language header
  const acceptLanguage = request.headers.get("accept-language") ?? "";
  const preferredLocale =
    locales.find((locale) => acceptLanguage.toLowerCase().includes(locale)) ??
    defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|studio|favicon.ico|assets|brochure|robots.txt|sitemap.xml|.*\\.).*)"],
};
