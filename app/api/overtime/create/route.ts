import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(request: Request) {
  try {
    // 1. Verifikasi Token
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, SECRET);
    const userId = payload.userId;

    // 2. Ambil & Validasi Body
    const body = await request.json();
    const { tanggal, jam_array, keterangan } = body;

    if (!tanggal || !jam_array || !Array.isArray(jam_array) || jam_array.length === 0) {
      return NextResponse.json(
        {
          status: "fail",
          message: "Data tidak lengkap atau format jam tidak valid",
        },
        { status: 400 },
      );
    }

    // 3. Operasi Database
    const sql = `
            INSERT INTO overtime (user_id, tanggal, jam_array, keterangan, status)
            VALUES ($1, $2, $3, $4, 'Pending')
            RETURNING *;
        `;

    const result = await query(sql, [userId, tanggal, JSON.stringify(jam_array), keterangan || null]);

    // 4. Response Sukses
    return NextResponse.json(
      {
        status: "success",
        message: "Pengajuan lembur berhasil disimpan",
        data: result.rows[0],
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Overtime Creation Error Log:", error);

    // Cek jika error berasal dari verifikasi JWT
    if (error.code === "ERR_JWT_EXPIRED") {
      return NextResponse.json({ status: "error", message: "Sesi habis, silakan login kembali" }, { status: 401 });
    }

    return NextResponse.json(
      {
        status: "error",
        message: "Gagal menyimpan pengajuan lembur ke database",
      },
      { status: 500 },
    );
  }
}
