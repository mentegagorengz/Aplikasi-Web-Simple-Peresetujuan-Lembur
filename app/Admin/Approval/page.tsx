"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";

interface Submission {
  id: number;
  nama: string;
  tanggal: string;
  jam: string;
  keterangan: string;
}

export default function ApprovalPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch("/api/overtime/pending");
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    }
  };

  const approveSubmission = async (id: number) => {
    try {
      const res = await fetch(`/api/overtime/approve/${id}`, { method: "POST" });
      if (res.ok) {
        alert("Pengajuan disetujui!");
        fetchSubmissions();
      }
    } catch (error) {
      console.error("Failed to approve:", error);
    }
  };

  const rejectSubmission = async (id: number) => {
    try {
      const res = await fetch(`/api/overtime/reject/${id}`, { method: "POST" });
      if (res.ok) {
        alert("Pengajuan ditolak!");
        fetchSubmissions();
      }
    } catch (error) {
      console.error("Failed to reject:", error);
    }
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
              <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Tanggal</th>
              <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Jam</th>
              <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Keterangan</th>
              <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {submissions.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  Tidak ada pengajuan yang menunggu persetujuan
                </td>
              </tr>
            ) : (
              submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-5">
                    <span className="font-bold text-slate-800 text-sm uppercase">{sub.nama}</span>
                  </td>
                  <td className="p-5 text-center text-slate-600 text-sm">{sub.tanggal}</td>
                  <td className="p-5 text-center text-slate-600 text-sm font-mono">{sub.jam}</td>
                  <td className="p-5 text-slate-600 text-sm italic">{sub.keterangan}</td>
                  <td className="p-5 text-right">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => approveSubmission(sub.id)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all text-xs font-bold shadow-sm flex items-center gap-1">
                        <CheckCircle size={14} />
                        APPROVE
                      </button>
                      <button onClick={() => rejectSubmission(sub.id)} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all text-xs font-bold shadow-sm flex items-center gap-1">
                        <XCircle size={14} />
                        REJECT
                      </button>
                    </div>
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
