import { redirect } from "next/navigation";

export default function RootPage() {
  /**
   * Logic Corporate:
   * Di sini nantinya kita akan melakukan pengecekan session/cookie.
   * Untuk sementara, kita langsung arahkan (redirect) ke halaman Login
   * agar flow aplikasinya rapi.
   */

  redirect("/Admin/Dashboard");

  // Return null karena fungsi ini hanya melakukan redirect
  return null;
}
