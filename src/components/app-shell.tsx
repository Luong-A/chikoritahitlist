import type { ReactNode } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/app-sidebar";

type AppShellProps = {
  children: ReactNode;
  title?: string;
  desc?: string;
};

export function AppShell({
  children,
  title,
  desc: description,
}: AppShellProps) {
  return (
    <div className="min-h-screen">
      <TooltipProvider>
        <SidebarProvider defaultOpen={false}>
          <AppSidebar />
          <SidebarInset className="min-h-screen bg-kbackgroundlight">
            <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-kprimarylight/40 bg-kbackgroundlight/95 px-4 backdrop-blur supports-backdrop-filter:bg-kbackgroundlight/80">
              <SidebarTrigger className="-ml-1 hover:bg-kprimarylight" />
              <div>
                {title ? (
                  <h2 className="text-lg font-semibold">{title}</h2>
                ) : null}
                {description ? (
                  <p className="text-sm text-muted-foreground">{description}</p>
                ) : null}
              </div>
            </header>
            <div className="flex-1 p-6">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </div>
  );
}
