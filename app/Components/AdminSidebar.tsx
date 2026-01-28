"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, ClipboardCheck, ScrollText, LogOut, Menu } from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/Admin/Dashboard", label: "Dashboard", icon: LayoutGrid },
    { href: "/Admin/Approval", label: "Persetujuan", icon: ClipboardCheck },
    { href: "/Admin/History", label: "History", icon: ScrollText },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col sticky top-0">
      <div className="p-6 flex items-center gap-3 border-b border-slate-50">
        <Menu className="text-slate-400" size={20} />
        <span className="text-lg font-bold text-slate-800 tracking-tight">Adminlab</span>
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

      <div className="p-4 border-t border-slate-100">
        <button className="flex items-center gap-4 px-4 py-3 w-full text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors group">
          <LogOut size={20} />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}
