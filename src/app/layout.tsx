import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/providers";
import { SiteExperienceGate } from "@/components/site-experience";
import "./globals.css";

export const metadata: Metadata = {
  title: "Krish Italiya — Software Engineer",
  description: "Software engineer at State Street, building reliable, user-focused software across frontend, backend, and cloud.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : "http://localhost:3000")
  ),
  openGraph: {
    title: "Krish Italiya — Software Engineer",
    description: "Building reliable, user-focused software across frontend, backend, and cloud.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Krish Italiya — Software Engineer",
    description: "Building reliable, user-focused software across frontend, backend, and cloud."
  },
  icons: { icon: "/icon.svg" }
};

export const viewport: Viewport = {
  themeColor: "#0b100d",
  colorScheme: "dark light"
};

const themeBootstrap = "(function(){try{var t=localStorage.getItem('krish-portfolio-theme')==='light'?'light':'dark';document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}catch(e){document.documentElement.dataset.theme='dark'}})();";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeBootstrap }} /></head>
      <body>
        <ThemeProvider>
          <SiteExperienceGate />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
