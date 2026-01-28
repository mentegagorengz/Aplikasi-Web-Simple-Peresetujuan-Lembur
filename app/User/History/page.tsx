"use client";
import React from "react";
import { History, Calendar, Clock, CheckCircle2, Timer, XCircle } from "lucide-react";
import { useLembur } from "../../contexts/LemburContext";
import { useAuth } from "../../contexts/AuthContext";

export default function UserHistoryPage() {
  const { getSubmissionsByUser } = useLembur();
  const { user } = useAuth();

  const history = user ? getSubmissionsByUser(user.nama) : [];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Riwayat Lembur Saya</h1>
          <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
            <span className="font-bold text-blue-600 uppercase tracking-wider text-[10px] bg-blue-50 px-2 py-0.5 rounded">Driver</span>
            {user?.nama || "Guest"}
          </p>
        </div>
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
          <History size={24} className="text-slate-400" />
        </div>
      </div>

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
            {history.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-400">
                  Belum ada data riwayat lembur
                </td>
              </tr>
            ) : (
              history.map((item) => (
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
                      ) : item.status === "Rejected" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-100">
                          <XCircle size={12} />
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
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">Menampilkan {history.length} data riwayat</p>
      </div>
    </div>
  );
}
