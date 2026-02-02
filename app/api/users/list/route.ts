import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const sql = `
      SELECT 
        id, 
        nama, 
        jabatan, 
        status -- Nama kolom adalah 'status', bukan 'status_enum'
      FROM users 
      WHERE jabatan != 'HC' 
      ORDER BY nama ASC
    `;
    const result = await query(sql);
    return NextResponse.json({ status: "success", data: result.rows });
  } catch (error: any) {
    console.error("DATABASE_ERROR:", error.message);
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}
