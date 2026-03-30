import { AppSidebar } from "@/components/app-sidebar";
import { WorkflowHeader } from "@/components/header/workflow-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        {/* <SiteHeader /> */}
        <WorkflowHeader/>
        <div className="flex p-0 flex-1">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
