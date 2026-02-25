"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { getRecentLeads, getRecentAttendance, getClasses } from "@/lib/firebase/services";
import { Loader2, UserPlus, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Lead, AttendanceRecord, Class } from "@/lib/types";

type ActivityItem = {
  id: string;
  type: 'lead' | 'attendance';
  title: string;
  description: string;
  date: Date;
  icon: React.ReactNode;
};

export function RecentActivity() {
  const { userProfile } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivity() {
      if (!userProfile?.tenantId) return;
      
      setLoading(true);
      try {
        const [leads, attendance, classes] = await Promise.all([
          getRecentLeads(userProfile.tenantId, 5),
          getRecentAttendance(userProfile.tenantId, 10),
          getClasses(userProfile.tenantId)
        ]);

        const items: ActivityItem[] = [];

        // Parse leads
        leads.forEach(lead => {
            const addedDate = new Date(lead.dateAdded);
            if (!isNaN(addedDate.getTime())) {
                items.push({
                    id: `lead-${lead.id}`,
                    type: 'lead',
                    title: 'New Lead Added',
                    description: `${lead.name} was added via ${lead.source || 'Direct'}.`,
                    date: addedDate,
                    icon: <UserPlus className="h-4 w-4 text-blue-500" />
                });
            }
        });

        // Parse attendance
        const classMap = new Map(classes.map(c => [c.id, c.title]));
        
        attendance.forEach(record => {
            // Check if it's already a JS Date, or a Firestore Timestamp (which has .toDate())
            let recordDate: Date;
            if (record.createdAt instanceof Date) {
                recordDate = record.createdAt;
            } else if (record.createdAt && typeof (record.createdAt as any).toDate === 'function') {
                recordDate = (record.createdAt as any).toDate();
            } else if (record.date instanceof Date) {
               recordDate = record.date;
            } else {
               recordDate = new Date(record.date);
            }

            const className = classMap.get(record.classId) || 'a class session';
            const presentCount = record.records.filter(r => r.present).length;

            if (!isNaN(recordDate.getTime())) {
                 items.push({
                    id: `att-${record.id}`,
                    type: 'attendance',
                    title: 'Attendance Marked',
                    description: `${presentCount} students present for ${className}.`,
                    date: recordDate,
                    icon: <CheckCircle2 className="h-4 w-4 text-green-500" />
                });
            }
        });

        // Sort by date, newest first
        items.sort((a, b) => b.date.getTime() - a.date.getTime());
        
        // Take top 5
        setActivities(items.slice(0, 5));

      } catch (error) {
        console.error("Failed to fetch recent activity:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchActivity();
  }, [userProfile?.tenantId]);

  if (loading && !userProfile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <div className="space-y-6">
            {activities.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="mt-0.5 bg-secondary p-2 rounded-full h-fit">
                    {item.icon}
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-medium leading-none">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <p className="text-xs text-muted-foreground font-mono mt-1">
                      {formatDistanceToNow(item.date, { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground py-6 text-center border border-dashed rounded-lg">
            No recent activity across your organization yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
