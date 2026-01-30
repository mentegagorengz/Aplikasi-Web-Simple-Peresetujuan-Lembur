import type { Metadata } from "next";
import "./globals.css";

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

            <main className="min-h-screen">{children}</main>

      </body>
    </html>
  );
}
