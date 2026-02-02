"use client";
import React, { useState, useEffect } from "react";
import { FileText, X, Users } from "lucide-react";
import { useGeneratePDF } from "@/hooks/useGeneratePDF";

interface Pegawai {
  id: number;
  nama: string;
  jabatan: string;
  status: string;
}

export default function DaftarPegawaiPage() {
  const { generateLemburPDF } = useGeneratePDF();
  const [daftarPegawai, setDaftarPegawai] = useState<Pegawai[]>([]);
  const [loading, setLoading] = useState(true);

  // State Modal & Filter
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPegawai, setSelectedPegawai] = useState<Pegawai | null>(null);
  const [bulan, setBulan] = useState(new Date().getMonth() + 1);
  const [tahun, setTahun] = useState(2026);

  const listBulan = ["JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI", "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"];

  // Fetch data pegawai dari database saat halaman dimuat
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users/list");
        const json = await res.json();
        setDaftarPegawai(json.data || []);
      } catch (err) {
        console.error("Gagal memuat data pegawai:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const openDownloadModal = (pegawai: Pegawai) => {
    setSelectedPegawai(pegawai);
    setIsModalOpen(true);
  };

  const handleDownload = async () => {
    if (!selectedPegawai) return;

    try {
      const res = await fetch(`/api/overtime/report?userId=${selectedPegawai.id}&bulan=${bulan}&tahun=${tahun}`);
      const result = await res.json();

      if (!res.ok || !result.data || result.data.length === 0) {
        alert(`Tidak ada data lembur yang Approved untuk ${selectedPegawai.nama} pada periode ini.`);
        return;
      }

      // SORTIR ULANG: Memastikan tanggal lebih awal (muda) di atas — ascending
      // Gunakan parser yang toleran untuk format tanggal seperti "DD-MM-YYYY" atau ISO
      const parseDateString = (s: string) => {
        if (!s) return new Date(0);
        // Coba parse langsung (ISO atau format yang bisa dikenali)
        const iso = new Date(s);
        if (!isNaN(iso.getTime())) return iso;

        // Jika gagal, coba split dan anggap formatnya DD-MM-YYYY atau DD/MM/YYYY
        const parts = s.split(/[-\/]/).map((p) => p.trim());
        if (parts.length === 3) {
          // Jika bagian pertama panjangnya 4, anggap YYYY-MM-DD
          if (parts[0].length === 4) {
            const y = Number(parts[0]);
            const m = Number(parts[1]) - 1;
            const d = Number(parts[2]);
            return new Date(y, m, d);
          }
          // Anggap format DD-MM-YYYY
          const d = Number(parts[0]);
          const m = Number(parts[1]) - 1;
          const y = Number(parts[2]);
          return new Date(y, m, d);
        }

        // Fallback
        return new Date(s);
      };

      const sortedItems = Array.isArray(result.data) ? (result.data as Array<{ tanggal: string }>).slice().sort((a, b) => parseDateString(a.tanggal).getTime() - parseDateString(b.tanggal).getTime()) : [];

      const dataLembur = (sortedItems as Array<{ tanggal: string; jam_array?: Array<{ mulai: string; selesai: string }>; keterangan?: string }>).map((item) => {
        // Perbaikan: parse tanggal secara eksplisit
        const dateObj = parseDateString(item.tanggal);

        const marks: number[] = [];
        if (item.jam_array) {
          item.jam_array.forEach((j) => {
            const start = parseInt(j.mulai.split(":")[0]);
            const end = parseInt(j.selesai.split(":")[0]);
            for (let h = start; h < end; h++) marks.push(h + 1);
          });
        }

        return {
          tanggal: dateObj.toLocaleDateString("id-ID").replace(/\//g, "-"),
          jamArray: marks,
          keterangan: item.keterangan,
        };
      });

      generateLemburPDF({
        nama: selectedPegawai.nama,
        jabatan: selectedPegawai.jabatan,
        periode: `${listBulan[bulan - 1]} ${tahun}`,
        bulan,
        tahun,
        items: dataLembur,
      });

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Terjadi kesalahan teknis saat mengunduh PDF.");
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Human Capital - Daftar Pegawai</h1>
          <p className="text-slate-500">Manajemen laporan lembur PT Hotel Indonesia Properti</p>
        </div>
        <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100">
          <Users className="text-blue-500" size={24} />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-20 text-center text-slate-400">Memuat data pegawai...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nama Pegawai</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">ID</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Jabatan</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {daftarPegawai.map((pegawai) => (
                <tr key={pegawai.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-700 uppercase text-sm">{pegawai.nama}</td>
                  <td className="px-6 py-4 text-slate-500 text-xs text-center font-mono">#{pegawai.id}</td>
                  <td className="px-6 py-4 text-slate-500 text-xs font-medium">{pegawai.jabatan}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-bold border border-green-100 uppercase">{pegawai.status}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => openDownloadModal(pegawai)} className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white transition-all font-bold text-[10px]">
                      <FileText size={14} />
                      EXPORT PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Periode (Tetap Sama dengan sedikit penyesuaian styling) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="font-bold text-slate-800">Periode Laporan</h3>
                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-tight">{selectedPegawai?.nama}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Select Bulan & Tahun sama seperti sebelumnya */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Bulan</label>
                  <select className="w-full p-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500" value={bulan} onChange={(e) => setBulan(Number(e.target.value))}>
                    {listBulan.map((name, index) => (
                      <option key={name} value={index + 1}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Tahun</label>
                  <select className="w-full p-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500" value={tahun} onChange={(e) => setTahun(Number(e.target.value))}>
                    <option value={2026}>2026</option>
                    <option value={2025}>2025</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50/50 flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
                BATAL
              </button>
              <button onClick={handleDownload} className="flex-1 py-2 bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 uppercase">
                <FileText size={16} /> DOWNLOAD
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
