import Footer from "@/components/Footer";
import Header from "@/components/shared/header";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen max-h-full flex-col">
      <Header />
      <main className="flex-1 wrapper">
        <Toaster />
        {children}
      </main>
      <Footer />
    </div>
  );
}
