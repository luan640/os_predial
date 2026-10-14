import { createClient } from "@/lib/supabase/server";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SidebarToggle } from "@/components/layout/sidebar-toggle";
import { SidebarProvider } from "@/components/layout/sidebar-context";
import { UserMenu } from "@/components/layout/user-menu";
import { PageHeaderProvider } from "@/components/layout/page-header-context";
import { HeaderBackSlot } from "@/components/layout/header-back-slot";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-background">
        <AppSidebar />

        <PageHeaderProvider>
          <div className="flex min-w-0 flex-1 flex-col">
            <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border bg-card px-4 md:px-6">
              <MobileNav />
              <SidebarToggle />
              <HeaderBackSlot />
              <div className="flex-1" />
              {user?.email && <UserMenu email={user.email} />}
            </header>
            <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">{children}</main>
          </div>
        </PageHeaderProvider>
      </div>
    </SidebarProvider>
  );
}
