import UserSidebar from "../Components/UserSidebar";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar - Fix Position */}
      <aside className="w-64 fixed h-screen bg-white border-r border-slate-200">
        <UserSidebar />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
