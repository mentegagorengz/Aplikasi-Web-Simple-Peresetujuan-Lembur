import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(request: Request) {
  const timestamp = new Date().toISOString();

  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        {
          status: "error",
          error: {
            code: "MISSING_CREDENTIALS",
            message: "Username dan password wajib diisi",
          },
          metadata: { timestamp },
        },
        { status: 400 },
      );
    }

    const sql = "SELECT * FROM users WHERE username = $1";
    const result = await query(sql, [username]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        {
          status: "error",
          error: {
            code: "INVALID_CREDENTIALS",
            message: "Username atau password salah",
          },
          metadata: { timestamp },
        },
        { status: 401 },
      );
    }

    if (user.status !== "Aktif") {
      return NextResponse.json(
        {
          status: "error",
          error: {
            code: "INACTIVE_USER",
            message: "Akun pengguna tidak aktif. Silakan hubungi administrator.",
          },
          metadata: { timestamp },
        },
        { status: 403 },
      );
    }

    const token = await new SignJWT({
      userId: user.id,
      jabatan: user.jabatan,
      nama: user.nama,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("8h")
      .sign(SECRET);

    const response = NextResponse.json(
      {
        status: "success",
        message: "Login berhasil",
        data: {
          token,
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
          api_version: "1.0",
        },
      },
      { status: 200 },
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login Error Log:", error);
    return NextResponse.json(
      {
        status: "error",
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Terjadi kesalahan pada server. Silakan coba lagi nanti.",
        },
        metadata: {
          timestamp,
          api_version: "1.0",
        },
      },
      { status: 500 },
    );
  }
}
