import type { Metadata } from "next";
import "./globals.css";
import { ReloadWatcher } from "./reload-watcher";

export const metadata: Metadata = {
  title: "Kosidinna Umeigbo - Developer, Blogger, Learner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true}>
        <ReloadWatcher />
        <main>{children}</main>
      </body>
    </html>
  );
}
