import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const timestamp = new Date().toISOString();

  try {
    const body = await request.json();
    const { nama, username, password, jabatan, signature } = body;

    if (!nama || !username || !password || !jabatan) {
      return NextResponse.json(
        {
          status: "error",
          error: {
            code: "VALIDATION_ERROR",
            message: "Data tidak lengkap. Nama, Username, Password, dan Jabatan wajib diisi.",
          },
          metadata: { timestamp },
        },
        { status: 400 },
      );
    }

    const existingUser = await query("SELECT id FROM users WHERE username = $1", [username]);
    if (existingUser && existingUser.rows.length > 0) {
      return NextResponse.json(
        {
          status: "error",
          error: {
            code: "DUPLICATE_USERNAME",
            message: "Username sudah digunakan oleh pegawai lain",
          },
          metadata: { timestamp },
        },
        { status: 409 },
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const insertQuery = `
      INSERT INTO users (nama, username, password, jabatan, signature, status)
      VALUES ($1, $2, $3, $4, $5, 'Aktif')
      RETURNING id, nama, username, jabatan;
    `;
    const values = [nama, username, hashedPassword, jabatan, signature || null];
    const result = await query(insertQuery, values);

    return NextResponse.json(
      {
        status: "success",
        message: "Pegawai berhasil ditambahkan ke sistem",
        data: result.rows[0],
        metadata: {
          timestamp,
          apiVersion: "1.0",
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Add User Error Log:", error);

    const isDbError = error.code === "28000";

    return NextResponse.json(
      {
        status: "error",
        error: {
          code: isDbError ? "DATABASE_AUTH_ERROR" : "INTERNAL_SERVER_ERROR",
          message: isDbError ? "Kredensial Database Salah. Periksa DB_USER di file .env Anda." : "Terjadi kesalahan internal pada server",
        },
        metadata: { timestamp },
      },
      { status: 500 },
    );
  }
}
