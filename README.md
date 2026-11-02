# KRISH.OS — Engineering Portfolio

An interactive portfolio for Krish Italiya, built with Next.js, React, TypeScript, Tailwind CSS, Framer Motion, Three.js, and MediaPipe.

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

## Hero portrait source

Add your portrait at \`public/portrait.png\`.

- A transparent PNG uses its alpha channel directly.
- An ordinary portrait PNG is segmented on-device with MediaPipe Selfie Segmenter before points are generated. The image itself is not uploaded to a remote image-processing service.
- Use a front-facing or slight three-quarter portrait, shoulders visible, even lighting, and a simple background for the cleanest result.
- When the asset is missing, the hero renders a temporary silhouette point-cloud rather than a rectangular grid.

The particle effect uses a Three.js point cloud and custom GPU shaders. The point positions, scatter paths, color and stagger values are prepared once; the vertex shader handles convergence and pointer response per frame.

MediaPipe assets are loaded on demand from Google's model storage and jsDelivr. Segmentation runs once for the static portrait, not as a continuous video task.

## Resume

The \`/resume\` route is a print-ready HTML resume. Use **Print / Save PDF** in the browser to export it.

## Deployment

Import this repository into Vercel. Set \`NEXT_PUBLIC_SITE_URL\` to the canonical production URL to publish an absolute sitemap URL.

## Content accuracy

Content is based on the supplied resume and public repositories. Foundry's local-only and non-sandboxed execution boundaries are called out explicitly. Competitive-programming figures reflect the supplied resume and should be revalidated against current profiles before external publication.
