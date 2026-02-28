
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Bell, 
  Check, 
  CheckCheck, 
  MessageSquare, 
  AlertCircle, 
  Calendar, 
  Trophy,
  Loader2 
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/use-auth";
import { subscribeToNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/lib/firebase/services";
import { Notification } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export function NotificationBell() {
  const { tenantId } = useParams() as { tenantId: string };
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user?.uid || !tenantId) return;

    const unsubscribe = subscribeToNotifications(tenantId, user.uid, (data) => {
      setNotifications(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid, tenantId]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await markNotificationAsRead(tenantId, notification.id);
    }
    if (notification.link) {
      router.push(notification.link);
      setOpen(false);
    }
  };

  const handleMarkAllRead = async () => {
    if (user?.uid) {
      await markAllNotificationsAsRead(tenantId, user.uid);
    }
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "announcement": return <MessageSquare className="w-4 h-4 text-primary" />;
      case "test": return <Calendar className="w-4 h-4 text-amber-500" />;
      case "grade": return <Trophy className="w-4 h-4 text-emerald-500" />;
      case "schedule": return <Calendar className="w-4 h-4 text-blue-500" />;
      default: return <Bell className="w-4 h-4 text-muted-foreground dark:text-white/40" />;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-10 w-10 p-0 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-white/5"
        >
          <Bell className="h-5 w-5 text-slate-600 dark:text-white/60" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -end-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-white border-2 border-background text-[10px] font-black rounded-full"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-glass-heavy border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl me-4 text-slate-900 dark:text-white" align="end">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/5">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h4>
          {unreadCount > 0 && (
            <Button  
              variant="ghost" 
              size="sm" 
              className="h-8 text-[10px] font-black uppercase text-primary hover:text-primary hover:bg-primary/10"
              onClick={handleMarkAllRead}
            >
              <CheckCheck className="w-3.5 h-3.5 me-1" /> Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground dark:text-white/20" />
            </div>
          ) : notifications.length > 0 ? (
            <div className="divide-y divide-slate-200 dark:divide-white/5">
              {notifications.map((n) => (
                <button
                  key={n.id}
                  className={cn(
                    "w-full text-start p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex gap-3",
                    !n.read && "bg-primary/5"
                  )}
                  onClick={() => handleNotificationClick(n)}
                >
                  <div className="mt-0.5 shrink-0">
                    {getIcon(n.type)}
                  </div>
                  <div className="space-y-1">
                    <p className={cn("text-xs font-bold text-slate-900 dark:text-white leading-tight", !n.read && "text-primary")}>
                      {n.title}
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-white/40 line-clamp-2 leading-relaxed font-light">
                      {n.body}
                    </p>
                    <p className="text-[10px] text-muted-foreground dark:text-white/20 font-medium">
                      {formatDistanceToNow(n.createdAt, { addSuffix: true })}
                    </p>
                  </div>
                  {!n.read && (
                    <div className="mt-1 shrink-0 h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-muted-foreground dark:text-white/20">
                <Bell className="w-6 h-6" />
              </div>
              <p className="text-xs text-muted-foreground dark:text-white/30">No notifications yet. You're all caught up!</p>
            </div>
          )}
        </ScrollArea>
        <div className="p-2 border-t border-slate-200 dark:border-white/5">
            <Button variant="ghost" className="w-full h-9 text-xs text-slate-600 dark:text-white/40 hover:text-slate-900 dark:hover:text-white" onClick={() => setOpen(false)}>
                Close
            </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
