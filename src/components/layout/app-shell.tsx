
"use client";
import type { ReactNode } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { MainHeader } from "@/components/layout/main-header";
import { Shield } from "lucide-react";
import Link from "next/link";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  // Get the initial state from cookies or localStorage if available
  // For simplicity, defaulting to true. In a real app, persist this.
  const defaultOpen = typeof window !== 'undefined' ? document.cookie.includes("sidebar_state=true") : true;


  return (
    <SidebarProvider defaultOpen={defaultOpen} open={defaultOpen}>
      <SidebarDocs>{children}</SidebarDocs>
    </SidebarProvider>
  );
}


function SidebarDocs({ children }: AppShellProps) {
  const { open } = useSidebar()
  return (
    <>
      <Sidebar variant="sidebar" collapsible="icon" side="left">
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            {open && <h1 className="text-xl font-semibold text-sidebar-foreground">NetWatch</h1>}
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter className="p-2">
          {/* Footer content if any, e.g., settings, logout */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <MainHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </>
  )
}
