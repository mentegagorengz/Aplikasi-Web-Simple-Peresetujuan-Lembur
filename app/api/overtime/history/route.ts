import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ status: "error" }, { status: 401 });

    const { payload } = await jwtVerify(token, SECRET);

    let sql = "";
    let params = [];

    if (payload.jabatan === "HC") {
      sql = `
        SELECT 
          o.id, u.nama, u.jabatan, o.tanggal::TEXT, 
          o.jam_array, o.keterangan, o.status
        FROM overtime o
        JOIN users u ON o.user_id = u.id
        WHERE o.status IN ('Approved', 'Rejected') -- Ambil semua orang
        ORDER BY o.updated_at DESC;
      `;
      params = [];
    } else {
      sql = `
        SELECT id, tanggal::TEXT, jam_array, keterangan, status
        FROM overtime 
        WHERE user_id = $1 -- Khusus milik sendiri
        ORDER BY tanggal DESC;
      `;
      params = [payload.userId];
    }

    const result = await query(sql, params);
    return NextResponse.json({ status: "success", data: result.rows }, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
