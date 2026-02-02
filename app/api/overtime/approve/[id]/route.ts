import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const timestamp = new Date().toISOString();

  try {
    const { id: overtimeId } = await params;

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
      UPDATE overtime 
      SET status = 'Approved', updated_at = NOW()
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
        message: "Pengajuan berhasil disetujui",
        data: result.rows[0],
        metadata: { timestamp },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Approve Error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Gagal menyetujui pengajuan",
        metadata: { timestamp },
      },
      { status: 500 },
    );
  }
}


export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, SECRET);

    if (payload.jabatan !== "HC") {
      return NextResponse.json({ status: "error", message: "Forbidden - Akses terbatas untuk HC" }, { status: 403 });
    }

    const sql = `
      SELECT 
        o.id, 
        u.nama, 
        u.jabatan, 
        o.tanggal::TEXT, 
        o.jam_mulai || ' - ' || o.jam_selesai as jam, 
        o.keterangan,
        o.status,
        o.updated_at
      FROM overtime o
      JOIN users u ON o.user_id = u.id
      WHERE o.status IN ('Approved', 'Rejected') -- Sesuai nilai ENUM di database
      ORDER BY o.updated_at DESC; -- Menampilkan yang terbaru diproses di urutan atas
    `;

    const result = await query(sql);

    return NextResponse.json(
      {
        status: "success",
        data: result.rows,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Fetch History Error:", error.message);
    return NextResponse.json(
      { status: "error", message: "Internal Server Error saat menarik histori" },
      { status: 500 }
    );
  }
}