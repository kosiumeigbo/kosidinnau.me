import type { Metadata } from "next";
import "./globals.css";

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
        <main>{children}</main>
      </body>
    </html>
  );
}
