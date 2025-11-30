import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quran Pulse - Digital Iqra Learning Platform",
  description: "Platform pembelajaran Iqra digital dengan analisis AI dan feedback real-time",
  keywords: ["Quran", "Iqra", "AI", "Learning", "Tajwid", "Arabic"],
  authors: [{ name: "Quran Pulse Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Quran Pulse - Digital Iqra Learning",
    description: "Platform pembelajaran Iqra digital dengan analisis AI dan feedback real-time",
    url: "https://quran-pulse.com",
    siteName: "Quran Pulse",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quran Pulse - Digital Iqra Learning",
    description: "Platform pembelajaran Iqra digital dengan analisis AI dan feedback real-time",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ms" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
