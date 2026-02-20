import { QuickAdd } from "@/components/dashboard/quick-add";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { UpcomingClasses } from "@/components/schedule/upcoming-classes";
import { PendingAssignments } from "@/components/dashboard/pending-assignments";
import { Separator } from "@/components/ui/separator";

export default function DashboardPage() {
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
