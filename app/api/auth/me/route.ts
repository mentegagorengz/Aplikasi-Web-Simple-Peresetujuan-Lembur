import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { query } from "@/lib/db";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

/**
 * @api {get} /api/auth/me Mengambil Profil User Terautentikasi
 * @description Validasi sesi melalui JWT HttpOnly Cookie dan sinkronisasi data database.
 */
export async function GET(request: Request) {
  const timestamp = new Date().toISOString();

  try {
    // 1. Ekstraksi Token (Standard Security Check)
    const token = (request as any).cookies?.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          status: "error",
          error: { code: "UNAUTHORIZED", message: "Sesi tidak ditemukan atau telah berakhir" },
          metadata: { timestamp },
        },
        { status: 401 },
      );
    }

    // 2. Verifikasi Integritas JWT
    const { payload } = await jwtVerify(token, SECRET);

    // 3. Sinkronisasi Data Real-time (Mencegah Stale Data)
    const sql = "SELECT id, nama, username, jabatan, status FROM users WHERE id = $1 LIMIT 1";
    const res = await query(sql, [payload.userId]);
    const user = res.rows[0];

    if (!user) {
      const response = NextResponse.json(
        {
          status: "error",
          error: { code: "USER_NOT_FOUND", message: "Identitas pengguna tidak valid di database" },
          metadata: { timestamp },
        },
        { status: 404 },
      );

      response.cookies.delete("token");
      return response;
    }

    if (user.status !== "Aktif") {
      const response = NextResponse.json(
        {
          status: "error",
          error: { code: "ACCOUNT_INACTIVE", message: "Akun Anda saat ini sedang dinonaktifkan" },
          metadata: { timestamp },
        },
        { status: 403 },
      );

      response.cookies.delete("token");
      return response;
    }

    return NextResponse.json({
      status: "success",
      message: "Profil user berhasil dimuat",
      data: {
        user: {
          id: user.id,
          nama: user.nama,
          username: user.username,
          jabatan: user.jabatan,
          status: user.status,
        },
      },
      metadata: {
        timestamp,
        apiVersion: "1.0",
        path: "/api/auth/me",
      },
    });
  } catch (error: any) {
    console.error("Critical Auth Me Error:", error.message);

    const isExpired = error.code === "ERR_JWT_EXPIRED";
    const response = NextResponse.json(
      {
        status: "error",
        error: {
          code: isExpired ? "SESSION_EXPIRED" : "INTERNAL_SERVER_ERROR",
          message: isExpired ? "Sesi Anda telah berakhir, silakan login kembali" : "Terjadi kegagalan sistem pada layanan identitas",
        },
        metadata: { timestamp },
      },
      { status: isExpired ? 401 : 500 },
    );

    if (isExpired) response.cookies.delete("token");
    return response;
  }
}
