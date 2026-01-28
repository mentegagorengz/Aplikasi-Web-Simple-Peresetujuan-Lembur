"use client";
import React from "react";
import { FileDown, FileText } from "lucide-react";
import { useGeneratePDF } from "../../../hooks/useGeneratePDF";
import { useLembur } from "../../contexts/LemburContext";

export default function AdminHistoryPage() {
  const { generateLemburPDF } = useGeneratePDF();
  const { getSubmissionsByStatus } = useLembur();
  const allHistory = getSubmissionsByStatus("Approved");

  const handlePrint = (item: any) => {
    const payload = {
      nama: item.nama,
      jabatan: item.jabatan,
      periode: item.periode,
      items: [
        {
          tanggal: item.tanggal,
          hari: item.hari,
          jam: item.jam,
          jamArray: item.jamArray,
          durasi: item.durasi,
          keterangan: item.keterangan,
        },
      ],
    };

    generateLemburPDF(payload);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">History Lembur</h1>
          <p className="text-slate-500 text-sm mt-1">Arsip data lembur yang telah divalidasi oleh HC.</p>
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
              <th className="p-5 text-[10px] font-bold text-slate-500 uppercase text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {allHistory.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  Belum ada data lembur yang disetujui
                </td>
              </tr>
            ) : (
              allHistory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="p-5 text-sm font-bold text-slate-800 uppercase">{item.nama}</td>
                  <td className="p-5 text-center text-sm text-slate-600">{item.tanggal}</td>
                  <td className="p-5 text-center text-sm font-mono text-slate-600">{item.jam}</td>
                  <td className="p-5 text-sm text-slate-600 italic">{item.keterangan}</td>
                  <td className="p-5 text-right">
                    <button onClick={() => handlePrint(item)} className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-xs font-bold transition-all">
                      <FileText size={14} />
                      CETAK PDF
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
