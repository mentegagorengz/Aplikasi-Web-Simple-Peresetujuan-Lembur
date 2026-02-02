import { redirect } from "next/navigation";

export default function RootPage() {

  redirect("/User/Submission");

  return null;
}
