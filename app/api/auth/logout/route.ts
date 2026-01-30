import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ status: "success", message: "Logout berhasil" }, { status: 200 });

  // Menghapus cookie dengan menyetel maxAge ke 0
  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0), // Set expired ke masa lalu
    path: "/",
  });

  return response;
}
