import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/providers";
import { AmbientCanvas, CustomCursor } from "@/components/visual-effects";
import "./globals.css";

export const metadata: Metadata = {
  title: "Krish Italiya — Software Engineer",
  description:
    "The engineering portfolio of Krish Italiya: software engineer building interfaces, systems, and developer tools.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : "http://localhost:3000")),
  openGraph: {
    title: "Krish Italiya — Software Engineer",
    description: "Interfaces, systems, and the connective tissue between them.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Krish Italiya — Software Engineer",
    description: "Interfaces, systems, and the connective tissue between them."
  },
  icons: { icon: "/icon.svg" }
};

export const viewport: Viewport = {
  themeColor: "#0a0d0b",
  colorScheme: "dark light"
};

const themeBootstrap = `(function(){try{var t=localStorage.getItem("krish-os-theme")||"system";var l=window.matchMedia("(prefers-color-scheme: light)").matches;document.documentElement.dataset.theme=t==="system"?(l?"light":"dark"):t}catch(e){document.documentElement.dataset.theme="dark"}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeBootstrap }} /></head>
      <body>
        <ThemeProvider>
          <AmbientCanvas />
          <CustomCursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
