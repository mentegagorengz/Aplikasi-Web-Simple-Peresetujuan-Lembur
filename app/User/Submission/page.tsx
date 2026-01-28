"use client";

import React, { useState } from "react";
import { Send, Calendar, Clock, ClipboardList, Info, Plus, Trash2 } from "lucide-react";
import { useLembur } from "../../contexts/LemburContext";
import { useAuth } from "../../contexts/AuthContext";

interface RowData {
  tanggal: string;
  jam: string;
  keterangan: string;
}

export default function SubmissionPage() {
  const { addSubmission } = useLembur();
  const { user } = useAuth();
  const [rows, setRows] = useState<RowData[]>([{ tanggal: "", jam: "", keterangan: "" }]);

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

  const calculateDuration = (jam: string): string => {
    const match = jam.match(/(\d+):(\d+)\s*-\s*(\d+):(\d+)/);
    if (!match) return "";
    const startHour = parseInt(match[1]);
    const endHour = parseInt(match[3]);
    return `${endHour - startHour} Jam`;
  };

  const getJamArray = (jam: string): number[] => {
    const match = jam.match(/(\d+):(\d+)\s*-\s*(\d+):(\d+)/);
    if (!match) return [];
    const startHour = parseInt(match[1]);
    const endHour = parseInt(match[3]);
    return Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
  };

  const getDayName = (dateString: string): string => {
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  const handleSubmit = () => {
    if (!user) return;

    const validRows = rows.filter((r) => r.tanggal && r.jam && r.keterangan);

    if (validRows.length === 0) {
      alert("Mohon lengkapi setidaknya satu baris data lembur!");
      return;
    }

    validRows.forEach((row) => {
      addSubmission({
        nama: user.nama,
        jabatan: "DRIVER",
        periode: new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" }),
        tanggal: new Date(row.tanggal).toLocaleDateString("id-ID"),
        hari: getDayName(row.tanggal),
        jam: row.jam,
        jamArray: getJamArray(row.jam),
        durasi: calculateDuration(row.jam),
        keterangan: row.keterangan,
      });
    });

    alert(`${validRows.length} data lembur berhasil dikirim ke HC untuk proses persetujuan!`);
    setRows([{ tanggal: "", jam: "", keterangan: "" }]);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Form Pengajuan Lembur</h1>
        <p className="text-slate-500 text-sm mt-1">Lengkapi detail aktivitas lembur Anda untuk divalidasi oleh HC.</p>
      </div>

      <div className="bg-white rounded-2xl p-6 mb-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
            <ClipboardList size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Driver Terdaftar</p>
            <h2 className="text-lg font-bold text-slate-800">{user?.nama || "Guest"}</h2>
          </div>
        </div>
        <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Periode Aktif</p>
          <p className="text-sm font-bold text-blue-700">{new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" })}</p>
        </div>
      </div>

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
              <th className="p-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, index) => (
              <tr key={index} className="hover:bg-slate-50/30 transition-colors">
                <td className="p-5">
                  <input type="date" value={row.tanggal} onChange={(e) => updateRow(index, "tanggal", e.target.value)} className="w-full bg-transparent text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-2 py-1" />
                </td>
                <td className="p-5">
                  <input type="text" value={row.jam} onChange={(e) => updateRow(index, "jam", e.target.value)} placeholder="17:00-21:00" className="w-full bg-transparent text-sm text-center text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-2 py-1 font-mono" />
                </td>
                <td className="p-5">
                  <input type="text" value={row.keterangan} onChange={(e) => updateRow(index, "keterangan", e.target.value)} placeholder="Contoh: Operasional Kantor" className="w-full bg-transparent text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-2 py-1 italic" />
                </td>
                <td className="p-5 text-center">
                  <button onClick={() => removeRow(index)} disabled={rows.length === 1} className="text-red-500 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="p-4 border-t border-slate-100">
          <button onClick={addRow} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-bold transition-all">
            <Plus size={16} />
            Tambah Baris
          </button>
        </div>
      </div>

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
