import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  const timestamp = new Date().toISOString();

  try {
    const sql = `
      SELECT id, nama, username, jabatan, status, signature, created_at 
      FROM users 
      ORDER BY created_at DESC
    `;

    const result = await query(sql);

    return NextResponse.json(
      {
        status: "success",
        message: "Daftar pegawai berhasil dimuat",
        data: result.rows,
        metadata: {
          total_count: result.rowCount,
          timestamp,
          api_version: "1.0"
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Fetch Users Error Log:", error);
    
    return NextResponse.json(
      {
      status: "error",
      error: {
        code: "FETCH_DATA_FAILED",
        message: "Gagal memuat daftar pegawai dari server",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      metadata: { timestamp },
    },      
      { status: 500 },
    );
  }
}



























// import { NextResponse } from "next/server";
// import { query } from "@/lib/db";

// export async function GET() {
//   try {
//     // Mengambil data user tanpa menyertakan kolom password demi keamanan (Security Best Practice)
//     const sql = `
//       SELECT id, nama, username, jabatan, status, signature, created_at 
//       FROM users 
//       ORDER BY created_at DESC
//     `;

//     const result = await query(sql);

//     // Memberikan response profesional dengan total count
//     return NextResponse.json(
//       {
//         success: true,
//         total: result.rowCount,
//         data: result.rows,
//       },
//       { status: 200 },
//     );
//   } catch (error: any) {
//     console.error("Fetch Users Error:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         error: "Gagal memuat daftar pegawai",
//       },
//       { status: 500 },
//     );
//   }
// }
