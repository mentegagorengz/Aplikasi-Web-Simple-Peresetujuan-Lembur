"use client";

import React, { useState } from "react";

export default function ApprovalPage() {
  const [submissions, setSubmissions] = useState([{ id: 1, nama: "ABDUL AZIS", periode: "Januari 2026", status: "Pending", tanggal: "2026-01-24" }]);

  const handleApprove = (id: number) => {
    setSubmissions(submissions.map((s) => (s.id === id ? { ...s, status: "Approved" } : s)));
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Antrean Persetujuan</h1>
        <p className="text-slate-500 text-sm mt-1">Daftar pengajuan lembur yang memerlukan validasi.</p>
      </div>

      <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-slate-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200">
              <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Pegawai</th>
              <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Periode</th>
              <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
              <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {submissions.map((sub) => (
              <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-5">
                  <span className="font-bold text-slate-800 text-sm uppercase">{sub.nama}</span>
                </td>
                <td className="p-5 text-center text-slate-600 text-sm">{sub.periode}</td>
                <td className="p-5 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${sub.status === "Approved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{sub.status}</span>
                </td>
                <td className="p-5 text-right">
                  {sub.status === "Pending" ? (
                    <button onClick={() => handleApprove(sub.id)} className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all text-xs font-bold shadow-sm">
                      APPROVE
                    </button>
                  ) : (
                    <button className="bg-slate-100 text-slate-600 px-5 py-2 rounded-lg text-xs font-bold cursor-default">BERHASIL</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
