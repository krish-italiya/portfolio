# Krish Italiya — Software Engineer Portfolio

A responsive, dark-first software engineer portfolio with an independently designed light theme, a session-only branded intro, a readiness-based loader, scroll-linked reveals, an interactive project filter, and responsive project/experience sections.

## Stack

- Next.js 16 / React 19 / TypeScript
- Tailwind CSS 4 with custom design tokens
- Framer Motion for scroll reveals, transitions, and interactive states
- Locally bundled transparent WebP portrait

## Local development

\`\`\`bash
npm install
npm run dev
\`\`\`

## Verification

\`\`\`bash
npm run lint
npm run build
\`\`\`

## Experience behavior

- The branded KRISH ITALIYA intro runs once per browser session.
- The functional loader only appears when critical portrait/font readiness exceeds 180ms; it disappears on actual readiness and does not show fake percentage progress.
- Next.js \`loading.tsx\` supplies a minimal route-level fallback.
- Section reveals use viewport entry and do not hijack native scrolling.
- The dark/light switch applies immediately with a short localized colour ripple.
- Project filters, experience details, theme switch, navigation and contact actions are keyboard accessible.
- The site respects \`prefers-reduced-motion\`.

## Content

Portfolio content is based on the supplied résumé and public repositories. Foundry is presented as one project among several and is clearly identified as a local educational prototype; its repository execution is not sandboxed. Competitive-programming values reflect the supplied résumé and should be refreshed before publication if they have changed.

## Deployment

Import this repository into Vercel and set \`NEXT_PUBLIC_SITE_URL\` to the canonical production URL.
