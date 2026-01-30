import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { query } from "@/lib/db";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(request: Request) {
  try {
    // 1. Ambil token dari HttpOnly Cookie (Best Practice Security)
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ status: "error", message: "Sesi tidak ditemukan" }, { status: 401 });
    }

    // 2. Verifikasi keaslian JWT
    const { payload } = await jwtVerify(token, SECRET);

    // 3. Ambil data terbaru dari DB (Menghindari stale data di frontend)
    // Gunakan parameter binding ($1) untuk mencegah SQL Injection
    const res = await query("SELECT id, nama, username, jabatan FROM users WHERE id = $1 LIMIT 1", [payload.userId]);

    const user = res.rows[0];

    // 4. Validasi jika user telah dihapus dari sistem namun token masih ada
    if (!user) {
      const response = NextResponse.json({ status: "error", message: "User tidak terdaftar di database" }, { status: 404 });
      // Hapus token yang sudah tidak valid
      response.cookies.delete("token");
      return response;
    }

    // 5. Response Sukses (Disesuaikan dengan kebutuhan frontend Anda)
    // Kita bungkus dalam objek 'user' agar sesuai dengan 'userData.user' di frontend
    return NextResponse.json({
      status: "success",
      user: {
        id: user.id,
        nama: user.nama,
        username: user.username,
        jabatan: user.jabatan,
      },
    });
  } catch (error: any) {
    console.error("Auth Me Error Log:", error.message);

    // 6. Penanganan spesifik jika token expired
    if (error.code === "ERR_JWT_EXPIRED") {
      const response = NextResponse.json({ status: "error", message: "Sesi Anda telah berakhir" }, { status: 401 });
      response.cookies.delete("token");
      return response;
    }

    return NextResponse.json({ status: "error", message: "Terjadi kesalahan pada server identitas" }, { status: 500 });
  }
}
