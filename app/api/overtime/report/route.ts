import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const bulan = searchParams.get("bulan");
  const tahun = searchParams.get("tahun");

  try {
    const sql = `
        SELECT 
            tanggal::TEXT, -- Tetap di-cast ke text untuk keperluan JSON
            jam_array, 
            keterangan,
            TO_CHAR(tanggal, 'TMMonth YYYY') as periode
        FROM overtime 
        WHERE user_id = $1 
        AND EXTRACT(MONTH FROM tanggal) = $2
        AND EXTRACT(YEAR FROM tanggal) = $3
        AND status = 'Approved'
        ORDER BY tanggal ASC; -- JANGAN gunakan tanggal::TEXT di sini
        `;

    const result = await query(sql, [userId, bulan, tahun]);

    return NextResponse.json({ status: "success", data: result.rows });
  } catch (error: any) {
    console.error("REPORT_API_ERROR:", error.message);
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}
