import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

    // Await params karena sekarang Promise di Next.js 15
    const { id: overtimeId } = await params;

    const sql = `
      UPDATE overtime 
      SET status = 'Rejected', updated_at = NOW()
      WHERE id = $1
      RETURNING *;
    `;

    const result = await query(sql, [overtimeId]);

    if (result.rowCount === 0) {
      return NextResponse.json({ status: "error", message: "Data overtime tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(
      {
        status: "success",
        message: "Pengajuan berhasil ditolak",
        data: result.rows[0],
        metadata: { timestamp },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Reject Error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Gagal menolak pengajuan",
        metadata: { timestamp },
      },
      { status: 500 },
    );
  }
}
