import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/Login") || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/Login", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, SECRET);

    if (pathname.startsWith("/Admin") && payload.jabatan !== "HC") {
      return NextResponse.redirect(new URL("/User/Submission", request.url));
    }
    if (pathname.startsWith("/User") && payload.jabatan === "HC") {
      return NextResponse.redirect(new URL("/Admin/Dashboard", request.url));
    }
    return NextResponse.next();
  } catch (error) {
    const response = NextResponse.redirect(new URL("/Login", request.url));
    response.cookies.delete("token");
    return response;
  }
}

export const config = {
  matcher: ["/Admin/:path*", "/User/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
};
