import { Footer } from "@/lib/components/layouts/footer";
import { NavBar } from "@/lib/components/layouts/nav-bar";

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
