import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IncidentZero | Voice-First Autonomous Cloud SRE",
  description: "Zero-Downtime Autonomous SRE Engine for Amazon Alexa+ Track with MCP Spec 2025-11-25 and AWS Bedrock integration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased selection:bg-cyan-500 selection:text-black min-h-screen">
        {children}
      </body>
    </html>
  );
}
