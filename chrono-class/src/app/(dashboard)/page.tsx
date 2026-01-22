import { QuickAdd } from "@/components/dashboard/quick-add";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { UpcomingClasses } from "@/components/schedule/upcoming-classes";
import { PendingAssignments } from "@/components/dashboard/pending-assignments";
import { Separator } from "@/components/ui/separator";
import { redirect } from 'next/navigation';

export default function DashboardPage() {
  // This is now the main dashboard, but we'll keep a redirect for any old links.
  // Although in this case, we are moving the dashboard here.
  // Let's assume the main authenticated view is the dashboard.
  return (
    <div className="space-y-6">
      <QuickAdd />
      <DashboardStats />
      <Separator />
      <div className="grid gap-6 md:grid-cols-2">
        <UpcomingClasses />
        <PendingAssignments />
      </div>
    </div>
  );
}
