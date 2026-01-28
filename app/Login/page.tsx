"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulasi Role-Based Access Control (RBAC)
    if (username === "azis" && password === "driver123") {
      // User: Abdul Azis [cite: 5, 12]
      router.push("/Submission");
    } else if (username === "tribudi" && password === "hc123") {
      // User: Tri Budi Ambarsari (HC)
      router.push("/Approval");
    } else {
      alert("Kredensial tidak valid. Silakan hubungi bagian IT/HC.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-[400px] bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-blue-900 p-6 text-center text-white">
          <h1 className="text-xl font-bold tracking-tight">SISTEM LEMBUR DIGITAL</h1>
          <p className="text-xs opacity-80 mt-1 uppercase">PT Hotel Indonesia Properti</p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleLogin} className="p-8 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm" placeholder="Masukkan NIK atau Username" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm" placeholder="••••••••" required />
          </div>

          <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-md transition-colors shadow-md mt-2">
            MASUK SISTEM
          </button>

          <div className="text-center mt-4 text-[10px] text-slate-400">&copy; 2026 PT Hotel Indonesia Properti. All Rights Reserved.</div>
        </form>
      </div>
    </div>
  );
}
