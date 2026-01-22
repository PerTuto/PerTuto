import { AuthProvider } from "@/hooks/use-auth";
import { AuthenticatedLayout } from "./authenticated-layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AuthenticatedLayout>{children}</AuthenticatedLayout>
    </AuthProvider>
  );
}
