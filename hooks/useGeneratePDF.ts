import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const useGeneratePDF = () => {
  const generateLemburPDF = async (data: any) => {
    const doc = new jsPDF("l", "mm", "a4");

    // 1. Header Identitas PT HIP [cite: 7]
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("PERHITUNGAN LEMBUR DRIVER", 148.5, 15, { align: "center" });
    doc.text("KANTOR PUSAT PT HOTEL INDONESIA PROPERTI", 148.5, 20, { align: "center" });

    // 2. Informasi Driver [cite: 2, 3, 4, 5]
    doc.setFontSize(9);
    doc.text(`NAMA      : ${data.nama}`, 20, 35);
    doc.text(`JABATAN   : ${data.jabatan}`, 20, 40);
    doc.text(`PERIODE   : ${data.periode}`, 20, 45);

    // 3. Struktur Tabel 24 Jam
    const jamHeaders = Array.from({ length: 24 }, (_, i) => ({
      content: (i + 1).toString(),
      styles: { halign: "center", valign: "middle" },
    }));

    const tableBody = data.items.map((item: any) => {
      const rowData = [item.tanggal, item.hari];
      const marks = Array(24).fill("");
      if (item.jamArray) {
        item.jamArray.forEach((j: number) => {
          if (j >= 1 && j <= 24) marks[j - 1] = "X";
        });
      }
      return [...rowData, ...marks, "", item.keterangan];
    });

    const minRows = 7;
    while (tableBody.length < minRows) {
      const emptyRow = Array(28).fill("");
      tableBody.push(emptyRow);
    }

    autoTable(doc, {
      startY: 55,
      head: [
        [
          { content: "TANGGAL", rowSpan: 2, styles: { halign: "center", valign: "middle" } },
          { content: "HARI", rowSpan: 2, styles: { halign: "center", valign: "middle" } },
          { content: "JAM LEMBUR", colSpan: 24, styles: { halign: "center" } },
          { content: "PARAF DIREKSI", rowSpan: 2, styles: { halign: "center", valign: "middle" } },
          { content: "KETERANGAN", rowSpan: 2, styles: { halign: "center", valign: "middle" } },
        ],
        jamHeaders,
      ],
      body: tableBody,
      theme: "grid",

      // --- PENGATURAN KHUSUS BODY ---
      bodyStyles: {
        halign: "center",
        valign: "middle",
        fontSize: 7,
        fontStyle: "normal",
        minCellHeight: 8, // Hanya baris body yang menjadi tinggi (8mm)
      },

      // --- PENGATURAN KHUSUS HEADER ---
      headStyles: {
        fillColor: [142, 132, 189], // Warna ungu
        textColor: [255, 255, 255],
        fontStyle: "normal",
        fontSize: 7,
        halign: "center",
        valign: "middle",
        minCellHeight: 0, // Header tetap normal mengikuti ukuran teks
      },

      columnStyles: {
        27: { halign: "left", cellWidth: "auto" },
      },

      styles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
        fontStyle: "normal",
        fontSize: 7,
        cellPadding: 1,
        // minCellHeight dihapus dari sini agar tidak merusak header
      },
    });

    // 4. Area Tanda Tangan (Posisi dinamis)
    let finalY = (doc as any).lastAutoTable.finalY + 25;

    // Proteksi Halaman
    if (finalY > 170) {
      doc.addPage();
      finalY = 30;
    }

    doc.setFontSize(9);

    // --- SISI KIRI (MENGETAHUI - HUMAN CAPITAL) ---
    doc.text("Mengetahui,", 20, finalY);
    doc.text("Human Capital Departemen", 20, finalY + 5);

    // --- LOGIKA TANDA TANGAN DIGITAL ---
    // Ukuran dikunci (Fixed Size) agar konsisten meskipun file aslinya besar/kecil
    const signWidth = 50; // 50mm (diperbesar dari 35mm)
    const signHeight = 50; // 30mm (diperbesar agar tidak gepeng)

    // Load image sebagai base64
    try {
      const response = await fetch("/signatures/hc-sign.png");
      const blob = await response.blob();
      const reader = new FileReader();

      await new Promise((resolve, reject) => {
        reader.onloadend = () => {
          if (reader.result) {
            // Posisi X=25 agar sedikit menjorok ke kanan dari teks "Mengetahui"
            // Posisi Y dinaikkan ke atas (finalY+3 dari sebelumnya finalY+7)
            doc.addImage(reader.result as string, "PNG", 25, finalY - 5, signWidth, signHeight);
            resolve(true);
          } else {
            reject(new Error("Failed to load image"));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.warn("Failed to load signature image:", error);
      // Lanjutkan tanpa signature jika gagal
    }

    doc.setFont("helvetica", "bold");
    doc.text("Tri Budi Ambarsari", 20, finalY + 30);
    doc.line(20, finalY + 31, 70, finalY + 31); // Garis bawah nama

    // --- SISI KANAN (PEGAWAI) ---
    doc.setFont("helvetica", "normal");
    doc.text("Pegawai,", 220, finalY + 5);

    doc.setFont("helvetica", "bold");
    doc.text(data.nama, 220, finalY + 30);
    doc.line(220, finalY + 31, 270, finalY + 31); // Garis bawah nama

    doc.save(`LEMBURAN_${data.nama}.pdf`);
  };

  return { generateLemburPDF };
};
