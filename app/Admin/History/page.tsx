"use client";
import React, { useState } from "react";
import { FileDown, FileText } from "lucide-react";
// Gunakan relative path jika alias @/ bermasalah
import { useGeneratePDF } from "../../../hooks/useGeneratePDF";

export default function AdminHistoryPage() {
  // Panggil fungsi asli dari hook
  const { generateLemburPDF } = useGeneratePDF();

  // Data sesuai dokumen fisik [cite: 5, 6]
  const [allHistory] = useState([
    {
      id: 1,
      nama: "ABDUL AZIS",
      tanggal: "24-01-2026",
      hari: "Sabtu",
      jam: "17:00-21:00",
      durasi: "4 Jam",
      keterangan: "JEMPUT BU Austri dan Bu AMBAR",
      status: "Approved",
    },
  ]);

  const handlePrint = (item: any) => {
    // Mapping data agar sesuai dengan template HC [cite: 9, 10]
    const payload = {
      nama: item.nama, // [cite: 5]
      jabatan: "DRIVER", // [cite: 3]
      periode: "JANUARI 2026", // [cite: 4]
      items: [
        {
          tanggal: item.tanggal, // [cite: 6]
          hari: item.hari,
          jam: item.jam, // [cite: 6]
          durasi: item.durasi,
          keterangan: item.keterangan, // [cite: 6]
        },
      ],
    };

    // Sekarang ini akan menjalankan logika jsPDF, bukan JSON
    generateLemburPDF(payload);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">History Lembur</h1>
          <p className="text-slate-500 text-sm mt-1">Arsip data lembur divalidasi oleh HC[cite: 9].</p>
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
              <th className="p-5 text-[10px] font-bold text-slate-500 uppercase text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {allHistory.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                <td className="p-5 text-sm font-bold text-slate-800 uppercase">{item.nama}</td>
                <td className="p-5 text-center text-sm text-slate-600">{item.tanggal}</td>
                <td className="p-5 text-center text-sm font-mono text-slate-600">{item.jam}</td>
                <td className="p-5 text-right">
                  <button onClick={() => handlePrint(item)} className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-xs font-bold transition-all">
                    <FileText size={14} />
                    CETAK PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
