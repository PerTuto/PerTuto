import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AvailabilityForm } from "@/components/settings/availability-form";
import { SmartSchedule } from "@/components/settings/smart-schedule";
import { Separator } from "@/components/ui/separator";
import { ConnectCalendarButton } from "@/components/settings/connect-calendar-button";
import { TeamManagementCard } from "@/components/settings/team-management-card";


export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">My Availability</CardTitle>
          <CardDescription>
            Define your working hours across different timezones. This will be used by the Smart Scheduler.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AvailabilityForm />
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Smart Schedule Assistant</CardTitle>
          <CardDescription>
            Let AI find the optimal time and location for a new class based on multiple constraints.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SmartSchedule />
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Integrations</CardTitle>
          <CardDescription>Connect external services to specific to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Google Calendar</p>
              <p className="text-sm text-muted-foreground">
                Sync your classes to your personal Google Calendar.
              </p>
            </div>
            <ConnectCalendarButton />
          </div>
        </CardContent>
      </Card>

      <Separator />

      <TeamManagementCard />
    </div>

  );
}

