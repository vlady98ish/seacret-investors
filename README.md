# Sea'cret Investors

Luxury real estate marketing site scaffold for Sea'cret Residences Chiliadou.

## What is included

- `Next.js` app structure ready for a multilingual marketing site
- `Sanity` Studio configuration and starter schemas
- English, Hebrew, Russian, and Greek homepage content
- Contact form endpoint scaffold at `/api/contact`
- Real extracted images from the provided PDF in `public/assets/pdf`

## NPM note for this machine

This machine injects local proxy variables into shell sessions. If `npm install` returns `403 Forbidden` from `https://registry.npmjs.org/`, run npm commands without those proxy variables:

```bash
/usr/bin/env -u http_proxy -u https_proxy -u HTTP_PROXY -u HTTPS_PROXY -u all_proxy -u ALL_PROXY -u ftp_proxy -u FTP_PROXY -u npm_config_proxy -u npm_config_http_proxy -u npm_config_https_proxy -u NPM_CONFIG_PROXY -u NPM_CONFIG_HTTP_PROXY -u NPM_CONFIG_HTTPS_PROXY -u YARN_HTTP_PROXY -u YARN_HTTPS_PROXY -u WS_PROXY -u WSS_PROXY -u ws_proxy -u wss_proxy npm install
```

## Required environment variables

Copy `.env.example` to `.env.local` and fill:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
RESEND_API_KEY=
CONTACT_RECIPIENT=
```

## After npm access works

```bash
npm install
npm run dev
```

Open:

- site: `http://localhost:3000/en`
- studio: `http://localhost:3000/studio`

## Recommended next integrations

1. Create the Sanity project and fill `NEXT_PUBLIC_SANITY_PROJECT_ID`.
2. Replace placeholder contact details in `lib/content.ts`.
3. Connect the contact form to Resend or another delivery service.
4. Add GA4, Search Console, and Tag Manager.
5. Replace PDF-derived images with original renders when available.
