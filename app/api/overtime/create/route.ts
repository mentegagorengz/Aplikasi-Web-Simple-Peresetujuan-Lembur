import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(request: Request) {
  const timestamp = new Date().toISOString();
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, SECRET);

    const body = await request.json();
    const { tanggal, jam_array, keterangan } = body;

    if (!tanggal || !jam_array || !Array.isArray(jam_array)) {
      return NextResponse.json({ status: "error", message: "Payload invalid" }, { status: 400 });
    }

    const insertSql = `
      INSERT INTO overtime (user_id, tanggal, jam_array, keterangan, status, created_at)
      VALUES ($1, $2, $3::jsonb, $4, 'Pending', NOW())
      RETURNING *;
    `;

    const values = [payload.userId, tanggal, JSON.stringify(jam_array), keterangan || null];
    const result = await query(insertSql, values);

    return NextResponse.json({ status: "success", message: "Pengajuan terkirim", data: result.rows[0], metadata: { timestamp } }, { status: 201 });
  } catch (error) {
    console.error("Create Overtime Error:", error);
    return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 });
  }
}
