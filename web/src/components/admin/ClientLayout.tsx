"use client";

import AdminSidebar from "@/sections/sidebar/AdminSidebar";
import { usePathname } from "next/navigation";
import { useSettingsContext } from "@/components/settings/SettingsProvider";
import { ApplicationStatus } from "@/app/admin/settings/interfaces";
import Button from "@/refresh-components/buttons/Button";
import { AdminSidebarProvider, useAdminSidebarContext } from "@/sections/sidebar/AdminSidebarContext";
import IconButton from "@/refresh-components/buttons/IconButton";
import SvgSidebar from "@/icons/sidebar";
import useScreenSize from "@/hooks/useScreenSize";
import { cn } from "@/lib/utils";

export interface ClientLayoutProps {
  children: React.ReactNode;
  enableEnterprise: boolean;
  enableCloud: boolean;
}

export function ClientLayout({
  children,
  enableEnterprise,
  enableCloud,
}: ClientLayoutProps) {
  const pathname = usePathname();
  const settings = useSettingsContext();
  const { isMobile } = useScreenSize();

  // Certain admin panels have their own custom sidebar.
  // For those pages, we skip rendering the default `AdminSidebar` and let those individual pages render their own.
  const hasCustomSidebar =
    pathname.startsWith("/admin/connectors") ||
    pathname.startsWith("/admin/embeddings");

  return (
    <div className="h-screen w-screen flex overflow-y-hidden">
      {settings.settings.application_status ===
        ApplicationStatus.PAYMENT_REMINDER && (
          <div className="fixed top-2 left-1/2 transform -translate-x-1/2 bg-amber-400 dark:bg-amber-500 text-gray-900 dark:text-gray-100 p-4 rounded-lg shadow-lg z-50 max-w-md text-center">
            <strong className="font-bold">Warning:</strong> Your trial ends in
            less than 5 days and no payment method has been added.
            <div className="mt-2">
              <Button className="w-full" href="/admin/billing">
                Update Billing Information
              </Button>
            </div>
          </div>
        )}

      {hasCustomSidebar ? (
        <div className="overflow-y-scroll w-full h-full flex">{children}</div>
      ) : (
        <AdminSidebarProvider>
          <AdminContent
            enableCloud={enableCloud}
            enableEnterprise={enableEnterprise}
            isMobile={isMobile}
          >
            {children}
          </AdminContent>
        </AdminSidebarProvider>
      )}
    </div>
  );
}

interface AdminContentProps {
  children: React.ReactNode;
  enableCloud: boolean;
  enableEnterprise: boolean;
  isMobile: boolean;
}

function AdminContent({
  children,
  enableCloud,
  enableEnterprise,
  isMobile,
}: AdminContentProps) {
  const { folded, setFolded } = useAdminSidebarContext();

  return (
    <>
      <AdminSidebar
        enableCloudSS={enableCloud}
        enableEnterpriseSS={enableEnterprise}
      />
      <div className="overflow-y-scroll w-full h-full flex flex-col">
        {/* Mobile menu button - only show on mobile when sidebar is folded */}
        {isMobile && folded && (
          <div className="flex-shrink-0 p-4">
            <IconButton
              icon={SvgSidebar}
              onClick={() => setFolded(false)}
              internal
            />
          </div>
        )}
        <div className="flex-1 pt-10 pb-4 px-4 md:px-12">{children}</div>
      </div>
    </>
  );
}
