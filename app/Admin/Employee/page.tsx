"use client";
import React, { useState } from "react";
import { FileText, X } from "lucide-react";
import { useGeneratePDF } from "@/hooks/useGeneratePDF";

export default function DaftarPegawaiPage() {
  const { generateLemburPDF } = useGeneratePDF();

  // State untuk Modal dan Pegawai terpilih
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPegawai, setSelectedPegawai] = useState<{ id: string; nama: string; jabatan: string; status: string } | null>(null);

  // State untuk Filter Periode (Default ke Januari 2026 sesuai dokumen)
  const [bulan, setBulan] = useState(1);
  const [tahun, setTahun] = useState(2026);

  const daftarPegawai = [
    { id: "KP267400", nama: "ABDUL AZIS", jabatan: "DRIVER", status: "Active" },
    { id: "TL651535", nama: "BUDI SANTOSO", jabatan: "DRIVER", status: "Active" },
    { id: "GB851535", nama: "M. KHOIRUL", jabatan: "DRIVER", status: "Active" },
  ];

  const listBulan = ["JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI", "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"];

  const openDownloadModal = (pegawai: { id: string; nama: string; jabatan: string; status: string }) => {
    setSelectedPegawai(pegawai);
    setIsModalOpen(true);
  };

  const handleDownload = async () => {
    if (!selectedPegawai) return;

    try {
      // Fetch data lembur dari API (untuk sementara menggunakan data dummy)
      // TODO: Implement API endpoint untuk mengambil data lembur berdasarkan pegawai

      // Sementara menggunakan data kosong, karena belum ada API endpoint yang sesuai
      const approvedData: Array<{
        tanggal: string;
        hari: string;
        jam: string;
        jamArray?: number[];
        keterangan: string;
        periode: string;
      }> = [];

      // Filter berdasarkan periode yang dipilih
      const listBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

      const periodeStr = `${listBulan[bulan - 1]} ${tahun}`;
      const filteredData = approvedData.filter((item) => item.periode === periodeStr);

      if (filteredData.length === 0) {
        alert(`Tidak ada data lembur yang di-approve untuk ${selectedPegawai.nama} pada periode ${periodeStr}`);
        return;
      }

      // Convert data ke format yang diperlukan PDF
      const dataLembur = filteredData.map((item) => {
        // Parse tanggal dari format "2026-01-24" ke "24-01-26"
        const date = new Date(item.tanggal);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = String(date.getFullYear()).slice(-2);

        return {
          tanggal: `${day}-${month}-${year}`,
          hari: item.hari,
          jam: item.jam,
          jamArray: item.jamArray || [],
          keterangan: item.keterangan,
        };
      });

      // Memanggil hook untuk generate PDF
      generateLemburPDF({
        nama: selectedPegawai.nama,
        jabatan: selectedPegawai.jabatan,
        periode: periodeStr,
        bulan: bulan,
        tahun: tahun,
        items: dataLembur,
      });

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Gagal mengunduh PDF. Silakan coba lagi.");
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Human Capital - Perhitungan Lembur</h1> [cite: 8]
        <p className="text-slate-500">Kantor Pusat PT Hotel Indonesia Properti</p>
      </div>

      {/* Tabel Pegawai */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Nama Pegawai</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">ID Pegawai</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Jabatan</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {daftarPegawai.map((pegawai) => (
              <tr key={pegawai.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-800">{pegawai.nama}</td>
                <td className="px-6 py-4 text-slate-500 text-sm">#{pegawai.id}</td>
                <td className="px-6 py-4 text-slate-500 text-sm">{pegawai.jabatan}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-semibold">{pegawai.status}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button onClick={() => openDownloadModal(pegawai)} className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm">
                    <FileText size={16} />
                    Export PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Periode */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800">Export Laporan Lembur</h3>
                <p className="text-xs text-slate-500">{selectedPegawai?.nama}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Pilih Bulan</label>
                <select className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={bulan} onChange={(e) => setBulan(Number(e.target.value))}>
                  {listBulan.map((name, index) => (
                    <option key={name} value={index + 1}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Pilih Tahun</label>
                <select className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={tahun} onChange={(e) => setTahun(Number(e.target.value))}>
                  <option value={2026}>2026</option>
                  <option value={2025}>2025</option>
                </select>
              </div>
            </div>

            <div className="p-6 bg-slate-50 flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-lg transition-colors">
                Batal
              </button>
              <button onClick={handleDownload} className="flex-1 py-2 bg-blue-600 text-white font-semibold hover:bg-blue-700 rounded-lg transition-colors shadow-md flex items-center justify-center gap-2">
                <FileText size={18} />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
