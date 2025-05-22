import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import '../styles/globals.css';
import Sidebar from "@/components/sidebar/Sidebar";
import Topbar from "@/components/Topbar";
import { AuthProvider } from "@/components/utils/AuthProvider";
import AuthGate from "@/components/AuthGate";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Periskope",
  description: "Periskope",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <AuthGate>
            <div className="flex h-screen">
              <Sidebar />

              <div className="flex flex-col flex-1 overflow-hidden">
                <Topbar />
                <div className="flex-1 overflow-auto bg-white">{children}</div>
              </div>
            </div>
          </AuthGate>
        </AuthProvider>
      </body>
    </html>
  );
}