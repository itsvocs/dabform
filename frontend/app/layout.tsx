import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/app/header";
import Footer from "@/components/app/footer";
import { AuthProvider } from "@/contexts/auth-context";
import { AnchoredToastProvider, ToastProvider } from "@/components/ui/toast"
import { ThemeProvider } from "next-themes";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DABFORM - Digitales Durchgangsarztbericht System",
  description: "DABFORM - Digitales Durchgangsarztbericht System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased flex flex-col min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ToastProvider position="top-right">
              <AnchoredToastProvider>
                <Header />
                <main className="grow">
                  {children}
                </main>
                <Footer />
              </AnchoredToastProvider>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
