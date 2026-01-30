import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
    }

    await jwtVerify(token, SECRET);

    const sql = `
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'Pending') as pending,
        COUNT(*) FILTER (WHERE status = 'Approved') as approved,
        COUNT(*) FILTER (WHERE status = 'Rejected') as rejected
      FROM overtime;
    `;

    const result = await query(sql);
    const stats = result.rows[0];

    return NextResponse.json({
      total: parseInt(stats.total) || 0,
      pending: parseInt(stats.pending) || 0,
      approved: parseInt(stats.approved) || 0,
      rejected: parseInt(stats.rejected) || 0,
    });
  } catch (error) {
    console.error("Stats Error:", error);
    return NextResponse.json(
      {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
      },
      { status: 500 },
    );
  }
}
