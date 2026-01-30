"use client";
import React, { useState, useEffect } from "react";
import { FileDown } from "lucide-react";

interface HistoryItem {
  id: number;
  nama: string;
  jabatan: string;
  tanggal: string;
  jam: string;
  keterangan: string;
}

export default function AdminHistoryPage() {
  const [allHistory, setAllHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/overtime/approved");
        if (res.ok) {
          const data = await res.json();
          setAllHistory(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch history:", error);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">History Lembur</h1>
          <p className="text-slate-500 text-sm mt-1">Arsip data lembur yang telah divalidasi oleh HC PT Hotel Indonesia Properti.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 shadow-sm transition-all">
          <FileDown size={16} className="text-green-600" />
          EXPORT EXCEL
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-slate-200">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-200">
            <tr>
              <th className="p-5 text-[10px] font-bold text-slate-500 uppercase">Driver</th>
              <th className="p-5 text-[10px] font-bold text-slate-500 uppercase text-center">Tanggal</th>
              <th className="p-5 text-[10px] font-bold text-slate-500 uppercase text-center">Jam</th>
              <th className="p-5 text-[10px] font-bold text-slate-500 uppercase">Keterangan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {allHistory.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-400 font-medium">
                  Belum ada data lembur yang disetujui.
                </td>
              </tr>
            ) : (
              allHistory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="p-5">
                    <div className="text-sm font-bold text-slate-800 uppercase">{item.nama}</div>
                    <div className="text-[10px] text-slate-400 font-medium">{item.jabatan}</div>
                  </td>
                  <td className="p-5 text-center text-sm text-slate-600 font-medium">{item.tanggal}</td>
                  <td className="p-5 text-center text-sm font-mono text-slate-600">{item.jam}</td>
                  <td className="p-5 text-sm text-slate-600 italic">{item.keterangan}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
