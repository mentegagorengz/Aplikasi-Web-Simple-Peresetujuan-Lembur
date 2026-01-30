import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(request: Request) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });

    const { payload } = await jwtVerify(token, SECRET);
    const userId = payload.userId;

    // Query disesuaikan dengan skema tabel baru Anda
    const sql = `
            SELECT 
                id, 
                tanggal::TEXT, -- Casting ke TEXT agar format tanggal stabil di JSON
                jam_array, 
                keterangan, 
                status,
                created_at
            FROM overtime 
            WHERE user_id = $1 
            ORDER BY tanggal DESC, created_at DESC;
        `;

    const result = await query(sql, [userId]);

    return NextResponse.json(
      {
        status: "success",
        data: result.rows, // JSONB otomatis diparsing sebagai Object oleh driver pg
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ status: "error", message: "Gagal mengambil histori" }, { status: 500 });
  }
}
