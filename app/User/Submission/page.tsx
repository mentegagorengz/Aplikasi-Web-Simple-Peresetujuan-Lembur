"use client";

import React, { useState } from "react";
import { Send, Calendar, Clock, ClipboardList, Info } from "lucide-react";

export default function SubmissionPage() {
  const [rows, setRows] = useState([{ tanggal: "2026-01-24", jam: "17:00-21:00", keterangan: "Jemput BU Austri dan BU AMBAR" }]);

  const handleSubmit = () => {
    alert("Data Lembur telah dikirim ke HC untuk proses persetujuan.");
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Form Pengajuan Lembur</h1>
        <p className="text-slate-500 text-sm mt-1">Lengkapi detail aktivitas lembur Anda untuk divalidasi oleh HC.</p>
      </div>

      {/* Driver Info Card */}
      <div className="bg-white rounded-2xl p-6 mb-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
            <ClipboardList size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Driver Terdaftar</p>
            <h2 className="text-lg font-bold text-slate-800">Abdul Azis</h2>
          </div>
        </div>
        <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Periode Aktif</p>
          <p className="text-sm font-bold text-blue-700">Januari 2026</p>
        </div>
      </div>

      {/* Form Input Container */}
      <div className="bg-white shadow-sm rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-200">
            <tr>
              <th className="p-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={14} /> Tanggal
              </th>
              <th className="p-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">
                <div className="flex items-center justify-center gap-2 text-nowrap">
                  <Clock size={14} /> Jam Lembur
                </div>
              </th>
              <th className="p-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Keterangan Kegiatan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, index) => (
              <tr key={index} className="hover:bg-slate-50/30 transition-colors">
                <td className="p-5">
                  <input type="date" value={row.tanggal} className="w-full bg-transparent text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-2 py-1" />
                </td>
                <td className="p-5">
                  <input type="text" value={row.jam} placeholder="17:00 - 21:00" className="w-full bg-transparent text-sm text-center text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-2 py-1 font-mono" />
                </td>
                <td className="p-5">
                  <input type="text" value={row.keterangan} placeholder="Contoh: Operasional Kantor" className="w-full bg-transparent text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-2 py-1 italic" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Footer */}
      <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-start gap-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100 max-w-xl">
          <Info className="text-blue-500 shrink-0 mt-0.5" size={18} />
          <p className="text-[11px] text-blue-700 leading-relaxed italic">Setelah dikirim, data akan masuk ke sistem antrean HC Departemen. Pastikan detail jam lembur sudah sesuai dengan catatan operasional harian Anda.</p>
        </div>

        <button onClick={handleSubmit} className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all group">
          <span>KIRIM SEKARANG</span>
          <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
