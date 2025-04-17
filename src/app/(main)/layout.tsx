import { Footer, NavBar } from "@/lib/components";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full flex-col gap-0">
      <NavBar />
      {children}
      <Footer />
    </div>
  );
}
