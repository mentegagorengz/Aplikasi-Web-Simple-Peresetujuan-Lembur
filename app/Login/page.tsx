"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const success = login(username, password);

    if (success) {
      if (username === "azis") {
        router.push("/User/Submission");
      } else if (username === "tribudi") {
        router.push("/Admin/Dashboard");
      }
    } else {
      setError("Kredensial tidak valid. Silakan hubungi bagian IT/HC.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-[400px] bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-900 p-6 text-center text-white">
          <h1 className="text-xl font-bold tracking-tight">SISTEM LEMBUR DIGITAL</h1>
          <p className="text-xs opacity-80 mt-1 uppercase">PT Hotel Indonesia Properti</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-5">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>}

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
