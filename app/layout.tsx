import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import { LemburProvider } from "./contexts/LemburContext";

export const metadata: Metadata = {
  title: "E-Lembur | PT Hotel Indonesia Properti",
  description: "Sistem Pengajuan Lembur Driver Digital",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased bg-slate-50 text-slate-900">
        <AuthProvider>
          <LemburProvider>
            <main className="min-h-screen">{children}</main>
          </LemburProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
