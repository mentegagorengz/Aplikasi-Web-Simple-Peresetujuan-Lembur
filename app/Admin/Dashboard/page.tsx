"use client";

import React from "react";
import { Clock, CheckCircle } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Selamat Datang, Admin</h1>
        <p className="text-slate-500 text-sm mt-1">Berikut adalah ringkasan aktivitas lembur saat ini.</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Menunggu Persetujuan</p>
            <p className="text-3xl font-black text-slate-900 mt-1">1</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-xl">
            <Clock className="text-yellow-600" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Sudah Disetujui</p>
            <p className="text-3xl font-black text-slate-900 mt-1">0</p>
          </div>
          <div className="bg-green-50 p-3 rounded-xl">
            <CheckCircle className="text-green-600" size={24} />
          </div>
        </div>
      </div>
    </div>
  );
}
