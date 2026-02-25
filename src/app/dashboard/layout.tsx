import { AuthProvider } from "@/hooks/use-auth";
import { SettingsProvider } from "@/hooks/use-settings";
import { AuthenticatedLayout } from "./authenticated-layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SettingsProvider>
        <AuthenticatedLayout>{children}</AuthenticatedLayout>
      </SettingsProvider>
    </AuthProvider>
  );
}
