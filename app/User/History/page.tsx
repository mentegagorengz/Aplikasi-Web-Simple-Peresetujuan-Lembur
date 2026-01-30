"use client";
import React, { useEffect, useState } from "react";
import { History, Calendar, Clock, CheckCircle2, Timer, XCircle } from "lucide-react";

interface Jam {
  mulai: string;
  selesai: string;
}

interface HistoryItem {
  id: number;
  tanggal: string;
  jam_array?: Jam[];
  keterangan?: string;
  status?: string;
}

export default function UserHistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [user, setUser] = useState<{ nama: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, historyRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/overtime/history"),
        ]);

        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData.data ?? null);
        } else {
          console.error("Failed to fetch user:", userRes.status);
        }

        if (historyRes.ok) {
          const historyData = await historyRes.json();
          setHistory(historyData.data ?? []);
        } else {
          console.error("Failed to fetch history:", historyRes.status);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const renderStatus = (status?: string) => {
    switch ((status ?? "").toLowerCase()) {
      case "approved":
      case "accept":
        return (
          <div className="inline-flex items-center gap-2 text-green-600">
            <CheckCircle2 size={16} />
            <span className="text-[12px] font-medium">Disetujui</span>
          </div>
        );
      case "rejected":
      case "declined":
        return (
          <div className="inline-flex items-center gap-2 text-red-600">
            <XCircle size={16} />
            <span className="text-[12px] font-medium">Ditolak</span>
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center gap-2 text-amber-600">
            <Timer size={16} />
            <span className="text-[12px] font-medium">Menunggu</span>
          </div>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Riwayat Lembur Saya</h1>
          <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
            <span className="font-bold text-blue-600 uppercase tracking-wider text-[10px] bg-blue-50 px-2 py-0.5 rounded">
              Driver
            </span>
            {user?.nama ?? "Loading..."}
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
              history.map((item) => {
                const jamData = item.jam_array?.[0] ?? null;
                const formattedDate = (() => {
                  try {
                    return new Date(item.tanggal).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    });
                  } catch {
                    return item.tanggal ?? "-";
                  }
                })();

                return (
                  <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="p-5 text-slate-700 font-medium">{formattedDate}</td>
                    <td className="p-5 text-center font-mono text-slate-600 bg-slate-50/50 text-[11px]">
                      {jamData ? `${jamData.mulai} - ${jamData.selesai}` : "---"}
                    </td>
                    <td className="p-5">
                      <p className="text-slate-500 italic text-xs leading-relaxed max-w-xs truncate">
                        "{item.keterangan ?? "-"}"
                      </p>
                    </td>
                    <td className="p-5 text-center">{renderStatus(item.status)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">
          Menampilkan {history.length} data riwayat
        </p>
      </div>
    </div>
  );
}
