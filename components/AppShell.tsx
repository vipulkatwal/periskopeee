"use client";

import Sidebar from "@/components/ui/Sidebar";
import Topbar from "@/components/ui/Topbar";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const isAuthPage = pathname.startsWith("/auth/signin") || pathname.startsWith("/auth/signup");

  if (loading) return null; // or a spinner

  return user && !isAuthPage ? (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <div className="flex-1 overflow-auto bg-white">{children}</div>
      </div>
    </div>
  ) : (
    <>{children}</>
  );
}