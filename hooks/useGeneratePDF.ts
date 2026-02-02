import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const HC_SIGNATURE_BASE64: string = "";

export const useGeneratePDF = () => {
  const getNamaHari = (tanggalStr: string) => {
    const dateParts = tanggalStr.split("-");
    const date = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));
    return date.toLocaleDateString("id-ID", { weekday: "long" });
  };

  const generateLemburPDF = (data: {
    nama: string;
    jabatan: string;
    periode: string;
    bulan: number; 
    tahun: number;
    items: Array<{
      tanggal: string;
      hari?: string;
      jam?: string;
      jamArray?: number[];
      durasi?: number;
      keterangan?: string;
    }>;
  }) => {
    const doc = new jsPDF("l", "mm", "a4");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("PERHITUNGAN LEMBUR DRIVER", 148.5, 15, { align: "center" });
    doc.text("KANTOR PUSAT PT HOTEL INDONESIA PROPERTI", 148.5, 20, {
      align: "center",
    });

    doc.setFontSize(9);
    doc.text(`NAMA      : ${data.nama}`, 20, 35);
    doc.text(`JABATAN   : ${data.jabatan}`, 20, 40);
    doc.text(`PERIODE   : ${data.periode}`, 20, 45);

    const tableBody: (string | number)[][] = [];

    const sortedItems = [...data.items].sort((a, b) => {
      const dateA = a.tanggal.split("-").reverse().join("");
      const dateB = b.tanggal.split("-").reverse().join("");
      return dateA.localeCompare(dateB);
    });

    sortedItems.forEach((item) => {
      const hariName = item.hari || getNamaHari(item.tanggal);

      const marks = Array(24).fill("");
      if (item.jamArray && Array.isArray(item.jamArray)) {
        item.jamArray.forEach((j: number) => {
          if (j >= 1 && j <= 24) marks[j - 1] = "x";
        });
      }

      tableBody.push([
        item.tanggal,
        hariName,
        ...marks,
        "", 
        item.keterangan || "",
      ]);
    });

    const minRows = 7;
    while (tableBody.length < minRows) {
      const emptyRow = ["", "", ...Array(24).fill(""), "", ""];
      tableBody.push(emptyRow);
    }

    const jamHeaders = Array.from({ length: 24 }, (_, i) => ({
      content: (i + 1).toString(),
      styles: { halign: "center" as const, valign: "middle" as const },
    }));

    autoTable(doc, {
      startY: 55,
      head: [
        [
          {
            content: "TANGGAL",
            rowSpan: 2,
            styles: { halign: "center", valign: "middle" },
          },
          {
            content: "HARI",
            rowSpan: 2,
            styles: { halign: "center", valign: "middle" },
          },
          {
            content: "JAM LEMBUR",
            colSpan: 24,
            styles: { halign: "center" },
          },
          {
            content: "PARAF",
            rowSpan: 2,
            styles: { halign: "center", valign: "middle" },
          },
          {
            content: "KETERANGAN",
            rowSpan: 2,
            styles: { halign: "center", valign: "middle" },
          },
        ],
        jamHeaders,
      ],
      body: tableBody,
      theme: "grid",
      bodyStyles: {
        halign: "center",
        valign: "middle",
        fontSize: 7,
        minCellHeight: 8,
      },
      headStyles: {
        fillColor: [142, 132, 189],
        textColor: [255, 255, 255],
        fontSize: 7,
      },
      columnStyles: {
        27: { halign: "left", cellWidth: "auto" }, // Kolom keterangan align left
      },
      styles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
      },
    });

    let finalY = (doc as any).lastAutoTable.finalY + 20;
    if (finalY > 170) {
      doc.addPage();
      finalY = 30;
    }

    doc.setFontSize(9);
    doc.text("Mengetahui,", 20, finalY);
    doc.text("Human Capital Departemen", 20, finalY + 5);

    if (HC_SIGNATURE_BASE64 && HC_SIGNATURE_BASE64.length > 100) {
      try {
        doc.addImage(HC_SIGNATURE_BASE64, "PNG", 25, finalY + 7, 35, 18);
      } catch (error) {
        console.error("Gagal memuat tanda tangan digital:", error);
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        doc.text("(Tanda Tangan Digital)", 25, finalY + 15);
      }
    } else {
      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      doc.text("(Tanda Tangan Digital)", 25, finalY + 15);
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Tri Budi Ambarsari", 20, finalY + 30);
    doc.line(20, finalY + 31, 70, finalY + 31);

    doc.setFont("helvetica", "normal");
    doc.text("Pegawai,", 220, finalY + 5);
    doc.setFont("helvetica", "bold");
    doc.text(data.nama, 220, finalY + 30);
    doc.line(220, finalY + 31, 270, finalY + 31);

    const fileName = `REKAP_LEMBUR_${data.nama.replace(/\s+/g, "_")}_${data.periode}.pdf`;
    doc.save(fileName);
  };

  return { generateLemburPDF };
};
