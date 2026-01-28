"use client";

import React from "react";
import { Clock, CheckCircle, XCircle, Users } from "lucide-react";
import { useLembur } from "../../contexts/LemburContext";

export default function AdminDashboard() {
  const { getSubmissionsByStatus, submissions } = useLembur();

  const pendingCount = getSubmissionsByStatus("Pending").length;
  const approvedCount = getSubmissionsByStatus("Approved").length;
  const rejectedCount = getSubmissionsByStatus("Rejected").length;
  const totalCount = submissions.length;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Selamat Datang, Admin</h1>
        <p className="text-slate-500 text-sm mt-1">Berikut adalah ringkasan aktivitas lembur saat ini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Total Pengajuan</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{totalCount}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-xl">
            <Users className="text-blue-600" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Menunggu Persetujuan</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{pendingCount}</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-xl">
            <Clock className="text-yellow-600" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Sudah Disetujui</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{approvedCount}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-xl">
            <CheckCircle className="text-green-600" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Ditolak</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{rejectedCount}</p>
          </div>
          <div className="bg-red-50 p-3 rounded-xl">
            <XCircle className="text-red-600" size={24} />
          </div>
        </div>
      </div>
    </div>
  );
}
