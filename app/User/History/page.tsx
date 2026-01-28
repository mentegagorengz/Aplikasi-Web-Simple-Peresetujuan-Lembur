"use client";
import React, { useState } from "react";
import { History, Calendar, Clock, CheckCircle2, Timer } from "lucide-react";

export default function UserHistoryPage() {
  const [history] = useState([
    {
      id: 1,
      tanggal: "24-01-26",
      jam: "17:00-21:00",
      keterangan: "JEMPUT BU Austri dan Bu AMBAR",
      status: "Approved",
    },
  ]);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Riwayat Lembur Saya</h1>
          <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
            <span className="font-bold text-blue-600 uppercase tracking-wider text-[10px] bg-blue-50 px-2 py-0.5 rounded">Driver</span>
            Abdul Azis
          </p>
        </div>
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
          <History size={24} className="text-slate-400" />
        </div>
      </div>

      {/* History Table Container */}
      <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-slate-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200">
              <th className="p-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <div className="flex items-center gap-2 italic">
                  <Calendar size={14} /> Tanggal
                </div>
              </th>
              <th className="p-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">
                <div className="flex items-center justify-center gap-2 italic">
                  <Clock size={14} /> Jam
                </div>
              </th>
              <th className="p-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Keterangan</th>
              <th className="p-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {history.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                <td className="p-5 text-slate-700 font-medium">{item.tanggal}</td>
                <td className="p-5 text-center font-mono text-slate-600">{item.jam}</td>
                <td className="p-5">
                  <p className="text-slate-500 italic text-xs capitalize leading-relaxed">"{item.keterangan.toLowerCase()}"</p>
                </td>
                <td className="p-5 text-center">
                  <div className="flex justify-center">
                    {item.status === "Approved" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-100">
                        <CheckCircle2 size={12} />
                        {item.status}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-yellow-50 text-yellow-700 border border-yellow-100">
                        <Timer size={12} />
                        {item.status}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Summary (Optional) */}
      <div className="mt-6 flex justify-end">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">Menampilkan {history.length} data riwayat terakhir</p>
      </div>
    </div>
  );
}
