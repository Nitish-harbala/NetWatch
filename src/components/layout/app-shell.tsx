
"use client";
import type { ReactNode } from "react";
import { useState, useEffect } from "react"; // Added useState and useEffect
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

const SIDEBAR_COOKIE_NAME = "sidebar_state"; // Used to read the cookie

export function AppShell({ children }: AppShellProps) {
  // Initialize sidebar state to be consistent for server and initial client render.
  // Defaulting to 'true' (expanded) as the server-side logic previously did.
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true); // Indicate that the component has mounted on the client.
    
    // On the client, after mounting, read the sidebar state from the cookie.
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${SIDEBAR_COOKIE_NAME}=`))
      ?.split('=')[1];

    if (cookieValue !== undefined) {
      setIsSidebarOpen(cookieValue === 'true');
    }
    // If the cookie isn't set, isSidebarOpen remains its initial value (true).
  }, []);

  // For SSR and the initial client render (before useEffect runs and hasMounted is true),
  // isSidebarOpen is 'true'. This ensures consistency.
  // After mounting, isSidebarOpen will reflect the cookie's value.
  // We pass 'isSidebarOpen' to the 'open' prop to control SidebarProvider.
  // 'onOpenChange' allows SidebarProvider to update AppShell's state.
  return (
    <SidebarProvider open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
      <SidebarDocs>{children}</SidebarDocs>
    </SidebarProvider>
  );
}


function SidebarDocs({ children }: AppShellProps) {
  const { open } = useSidebar(); // 'open' is now derived from the controlled SidebarProvider
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
