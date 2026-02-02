"use client";

import { useState } from "react";
import { Send, Calendar, Clock, ClipboardList, Info, Plus, Trash2 } from "lucide-react";

interface RowData {
  tanggal: string;
  jam: string;
  keterangan: string;
}

export default function SubmissionPage() {
  const [rows, setRows] = useState<RowData[]>([{ tanggal: "", jam: "", keterangan: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addRow = () => {
    setRows([...rows, { tanggal: "", jam: "", keterangan: "" }]);
  };

  const removeRow = (index: number) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  const updateRow = (index: number, field: keyof RowData, value: string) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const handleSubmit = async () => {
    const validRows = rows.filter((r) => r.tanggal && r.jam && r.keterangan);

    if (validRows.length === 0) {
      alert("Mohon lengkapi detail pengajuan lembur Anda.");
      return;
    }

    setIsSubmitting(true);

    try {
      const promises = validRows.map(async (row, index) => {
        if (!row.jam.includes("-")) {
          throw new Error(`Baris ${index + 1}: Format jam tidak valid (Gunakan tanda '-')`);
        }

        const [mulai, selesai] = row.jam.split("-").map((t) => t.trim());

        const payload = {
          tanggal: row.tanggal,
          jam_array: [{ mulai, selesai }],
          keterangan: row.keterangan,
        };

        const response = await fetch("/api/overtime/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorDetail = await response.json();
          throw new Error(errorDetail.message || "Gagal menyimpan ke sistem.");
        }
        return await response.json();
      });

      await Promise.all(promises);
      alert("Laporan lembur Anda telah berhasil diserahkan ke HC.");
      setRows([{ tanggal: "", jam: "", keterangan: "" }]);
    } catch (error: any) {
      alert(`Kendala: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Form Pengajuan Lembur</h1>
        <p className="text-slate-500 text-sm mt-1 font-medium">Dokumentasikan aktivitas lembur Anda secara digital.</p>
      </div>

      <div className="bg-white rounded-2xl p-6 mb-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100">
            <ClipboardList size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status Akses</p>
            <h2 className="text-lg font-bold text-slate-800">Pegawai Terverifikasi</h2>
          </div>
        </div>
        <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Periode Laporan</p>
          <p className="text-sm font-bold text-blue-700">{new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" })}</p>
        </div>
      </div>

      {/* Tabel Input */}
      <div className="bg-white shadow-sm rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-200">
            <tr>
              <th className="p-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={14} /> Tanggal
              </th>
              <th className="p-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">
                <div className="flex items-center justify-center gap-2">
                  <Clock size={14} /> Jam Lembur
                </div>
              </th>
              <th className="p-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Keterangan</th>
              <th className="p-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, index) => (
              <tr key={index} className="hover:bg-slate-50/30 transition-colors">
                <td className="p-5">
                  <input type="date" value={row.tanggal} onChange={(e) => updateRow(index, "tanggal", e.target.value)} className="w-full bg-transparent text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-2 py-1.5 border border-transparent hover:border-slate-200" />
                </td>
                <td className="p-5">
                  <input type="text" value={row.jam} onChange={(e) => updateRow(index, "jam", e.target.value)} placeholder="00:00-00:00" className="w-full bg-transparent text-sm text-center text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-2 py-1.5 font-mono border border-transparent hover:border-slate-200" />
                </td>
                <td className="p-5">
                  <input type="text" value={row.keterangan} onChange={(e) => updateRow(index, "keterangan", e.target.value)} placeholder="Misal: Operasional Direksi" className="w-full bg-transparent text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-2 py-1.5 italic border border-transparent hover:border-slate-200" />
                </td>
                <td className="p-5 text-center">
                  <button onClick={() => removeRow(index)} disabled={rows.length === 1} className="text-red-400 hover:text-red-600 disabled:opacity-20 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="p-4 border-t border-slate-100 bg-slate-50/30">
          <button onClick={addRow} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-xs font-bold uppercase tracking-wider">
            <Plus size={16} />
            Tambah Baris Baru
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-start gap-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100 max-w-xl">
          <Info className="text-blue-500 shrink-0 mt-0.5" size={18} />
          <p className="text-[11px] text-blue-700 leading-relaxed italic">Data yang Anda kirim akan diproses oleh Departemen Human Capital. Pastikan format jam sudah sesuai (contoh: 17:00-20:00).</p>
        </div>

        <button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:bg-slate-300">
          <span className="tracking-widest uppercase">{isSubmitting ? "Mengirim..." : "Kirim Laporan"}</span>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
