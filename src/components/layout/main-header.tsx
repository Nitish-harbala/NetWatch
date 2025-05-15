
"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { capitalize } from "@/lib/utils"; // Assuming a capitalize utility function

export function MainHeader() {
  const pathname = usePathname();
  let pageTitle = "Dashboard"; // Default title

  if (pathname === "/firewall") {
    pageTitle = "Firewall Configuration";
  } else if (pathname !== "/") {
     // Basic logic to get title from path
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 0) {
      pageTitle = segments.map(s => capitalize(s.replace(/-/g, " "))).join(" / ");
    }
  }


  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 shadow-sm">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <h1 className="text-lg font-semibold md:text-xl">{pageTitle}</h1>
      {/* Future additions: breadcrumbs, user menu, etc. */}
    </header>
  );
}
