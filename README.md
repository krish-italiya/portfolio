# KRISH.OS — Engineering Portfolio

An interactive portfolio for Krish Italiya, built from scratch with Next.js, TypeScript, Tailwind CSS, Framer Motion, Canvas, and Lucide.

## Local development

\`\`\`bash
npm install
npm run dev
\`\`\`

Open http://localhost:3000.

## Build and verify

\`\`\`bash
npm run lint
npm run build
\`\`\`

GitHub Actions runs lint and production build on pushes and pull requests to \`main\`.

## Portrait asset

The hero uses a Canvas particle assembly. Until a portrait is provided, it assembles the KI monogram. To use a real portrait, place a **transparent-background PNG** at:

\`public/portrait.png\`

A transparent cutout gives the particles a clean subject silhouette. A JPG or a photograph with a busy background will produce a weaker particle mask.

## Resume

The \`/resume\` route is a print-ready HTML resume. Use **Print / Save PDF** in the browser to export it.

## Deployment

The project is a standard Next.js app and can be deployed to Vercel by importing this repository. No environment variables are required for the public GitHub profile card.

## Content accuracy

Content is based on the supplied resume and public repositories. Foundry's local-only and non-sandboxed execution boundaries are called out explicitly. Competitive-programming figures reflect the supplied resume and should be revalidated against current profiles before external publication.
