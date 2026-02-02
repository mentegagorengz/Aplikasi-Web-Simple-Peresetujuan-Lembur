import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET() {
  const timestamp = new Date().toISOString();

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, SECRET);

    if (payload.jabatan !== "HC") {
      return NextResponse.json({ status: "error", message: "Forbidden - HC only" }, { status: 403 });
    }

    const sql = `
      SELECT 
        o.id, 
        u.nama, 
        u.jabatan,
        o.tanggal::TEXT, 
        o.jam_array, 
        o.keterangan,
        o.created_at
      FROM overtime o
      JOIN users u ON o.user_id = u.id
      WHERE o.status = 'Pending'
      ORDER BY o.created_at ASC;
    `;

    const result = await query(sql);

    const formattedData = result.rows.map((row) => ({
      id: row.id,
      nama: row.nama,
      jabatan: row.jabatan,
      tanggal: row.tanggal,
      jam: row.jam_array && row.jam_array.length > 0 ? `${row.jam_array[0].mulai} - ${row.jam_array[0].selesai}` : "-",
      keterangan: row.keterangan,
      waktu_pengajuan: row.created_at,
    }));

    return NextResponse.json({
      status: "success",
      message: `${formattedData.length} pengajuan ditemukan dalam antrean`,
      data: formattedData,
      metadata: { timestamp },
    });
  } catch (error) {
    console.error("Error fetching pending overtime requests:", error);
    return NextResponse.json(
      {
        status: "error",
        error: { code: "INTERNAL_SERVER_ERROR", message: "Terjadi kesalahan pada server" },
        metadata: { timestamp },
      },
      { status: 500 },
    );
  }
}
