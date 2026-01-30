"use client";
import React, { useState, useEffect } from "react";
import { FileDown, CheckCircle2, XCircle, Printer } from "lucide-react";

// 1. Penyesuaian Interface agar sesuai dengan JSON Response
interface Jam {
  mulai: string;
  selesai: string;
}

interface HistoryItem {
  id: number;
  nama: string;
  jabatan: string;
  tanggal: string;
  jam_array: Jam[]; // Menggunakan array object sesuai JSON
  keterangan: string;
  status: "Approved" | "Rejected";
}

export default function AdminHistoryPage() {
  const [allHistory, setAllHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/overtime/history");
        const data = await res.json();
        // Memastikan data terpetakan dengan benar
        setAllHistory(data.data || []);
      } catch (error) {
        console.error("Gagal menarik data histori:", error);
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
        <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 shadow-sm transition-all active:scale-95">
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
              <th className="p-5 text-[10px] font-bold text-slate-500 uppercase text-center">Status</th>
              <th className="p-5 text-[10px] font-bold text-slate-500 uppercase text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {allHistory.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-slate-400 font-medium">
                  Belum ada data lembur yang divalidasi.
                </td>
              </tr>
            ) : (
              allHistory.map((item) => {
                return (
                  <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="p-5">
                      <div className="text-sm font-bold text-slate-800 uppercase">{item.nama || "Unknown Driver"}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{item.jabatan || "Driver"}</div>
                    </td>
                    <td className="p-5 text-center text-sm text-slate-600 font-medium">{item.tanggal}</td>
                    <td className="p-5 text-center text-sm font-mono text-slate-600 bg-slate-50/50">{item.jam_array && item.jam_array.length > 0 ? `${item.jam_array[0].mulai} - ${item.jam_array[0].selesai}` : "-"}</td>
                    <td className="p-5 text-sm text-slate-600 italic leading-relaxed">"{item.keterangan || "-"}"</td>
                    <td className="p-5 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wide ${item.status === "Approved" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"}`}>
                        {item.status === "Approved" ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-5 text-center">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Cetak PDF">
                        <Printer size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
