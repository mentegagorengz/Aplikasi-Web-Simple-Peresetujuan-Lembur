"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FileText, History, LogOut, Menu } from "lucide-react";

export default function UserSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { href: "/User/Submission", label: "Pengajuan", icon: FileText },
    { href: "/User/History", label: "History", icon: History },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/Login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      router.push("/Login");
    }
  };

  return (
    <div className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col sticky top-0">
      <div className="p-6 flex items-center gap-3 border-b border-slate-50">
        <Menu className="text-slate-400" size={20} />
        <span className="text-lg font-bold text-slate-800 tracking-tight">E-Lembur</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${isActive ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}>
              <Icon size={20} />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 space-y-1">
        <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-3 w-full text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors group">
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}
