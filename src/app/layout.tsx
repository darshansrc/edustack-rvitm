import type { Metadata } from "next";
import "./globals.css";

import { Analytics } from "@vercel/analytics/react";

import StyledComponentsRegistry from "../lib/AntdRegistry";

export const metadata: Metadata = {
  title: "EduStack",
  description: "",
  manifest: "/manifest.json",
  icons: { apple: "/logo.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
