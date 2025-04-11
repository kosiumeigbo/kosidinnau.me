import type { Metadata } from "next";
import "./globals.css";
import { ReloadWatcher } from "@/lib/components/reload-watcher";

export const metadata: Metadata = {
  title: "Kosidinna Umeigbo",
  description: "Learner and developer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ReloadWatcher />
        <main>{children}</main>
      </body>
    </html>
  );
}
