"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Student } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import Link from "next/link";

const statusColors: { [key in Student['status']]: string } = {
  Active: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
  'On-hold': "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
  Graduated: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
  Dropped: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
};


export const columns: ColumnDef<Student>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <Link href={`/students/${student.id}`} className="flex items-center gap-3 group">
          <Avatar>
            <AvatarImage src={student.avatar} alt={student.name} />
            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium group-hover:underline">{student.name}</span>
            <span className="text-sm text-muted-foreground">{student.email}</span>
          </div>
        </Link>
      );
    },
  },
  {
    accessorKey: "timezone",
    header: "Local Time",
    cell: ({ row }) => {
      const timezone = row.getValue("timezone") as string;
      if (!timezone) return <span className="text-muted-foreground text-xs">-</span>;

      const TIMEZONE_MAP: Record<string, string> = {
        'EST': 'America/New_York',
        'EDT': 'America/New_York',
        'PST': 'America/Los_Angeles',
        'PDT': 'America/Los_Angeles',
        'CST': 'America/Chicago',
        'IST': 'Asia/Kolkata',
      };

      const ianaTz = TIMEZONE_MAP[timezone];
      if (!ianaTz) return <span className="text-xs">{timezone}</span>;

      try {
        const time = new Date().toLocaleTimeString([], { timeZone: ianaTz, hour: '2-digit', minute: '2-digit' });
        return (
          <div className="flex flex-col">
            <span className="font-medium text-sm">{time}</span>
            <span className="text-xs text-muted-foreground">{timezone}</span>
          </div>
        );
      } catch (e) {
        return <span className="text-xs">{timezone}</span>;
      }
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as Student['status'];
      return <Badge className={cn("border-transparent", statusColors[status])}>{status}</Badge>
    }
  },
  {
    accessorKey: "progress",
    header: "Overall Progress",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Progress value={row.getValue("progress")} className="w-24" />
        <span>{row.getValue("progress")}%</span>
      </div>
    ),
  },
  {
    accessorKey: "courses",
    header: "Courses",
    cell: ({ row }) => {
      const courses = row.getValue("courses") as string[];
      return <div className="flex gap-1 flex-wrap max-w-xs">{courses.map(c => <Badge variant="secondary" key={c}>{c}</Badge>)}</div>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/students/${student.id}`}>View student</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(student.id)}
            >
              Copy student ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit student</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
