# Krish Italiya — Software Engineer Portfolio

A responsive, dark-first software engineer portfolio with a separately designed light theme, a session-only brand intro, a readiness-based loader, scroll reveals, and a small interactive terminal.

## Stack

- Next.js 16 / React 19 / TypeScript
- Tailwind CSS 4 and custom CSS design tokens
- Framer Motion for entry and in-view transitions
- Locally bundled WebP portrait

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

GitHub Actions runs both checks on pushes and pull requests.

## Motion behavior

- The branded KRISH ITALIYA intro runs once per browser tab session.
- The functional loader only appears if the critical portrait/font readiness takes more than 180ms. It disappears when those resources are ready; it does not display a fake progress percentage or add an artificial minimum duration.
- Next.js \`loading.tsx\` supplies a minimal fallback for route-level loading.
- Scroll reveals use viewport entry and do not hijack native scrolling.
- The dark/light switch applies immediately with a short, localized colour ripple.
- The site respects \`prefers-reduced-motion\`.

## Content

Portfolio details are based on the supplied resume and project repositories. Foundry is one project among several and is clearly identified as a local educational prototype; its repository execution is not sandboxed. Competitive-programming values reflect the supplied resume figures and should be refreshed before publication if they have changed.

## Deployment

Import the repository into Vercel and set \`NEXT_PUBLIC_SITE_URL\` to the canonical production URL.
