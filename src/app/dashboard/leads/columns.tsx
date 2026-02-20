"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Lead } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const statusColors: { [key in Lead['status']]: string } = {
  New: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
  Contacted: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300",
  Qualified: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
  Converted: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
  Lost: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
};


export const getColumns = (onConvert: (lead: Lead) => void): ColumnDef<Lead>[] => [
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
      const lead = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{lead.name}</span>
          <span className="text-sm text-muted-foreground">{lead.email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as Lead['status'];
      return <Badge className={cn("border-transparent", statusColors[status])}>{status}</Badge>
    }
  },
  {
    accessorKey: "source",
    header: "Source",
    cell: ({ row }) => {
      const source = (row.getValue("source") as string) || "manual";
      const sourceColors: Record<string, string> = {
        website: "bg-green-900/50 text-green-300",
        manual: "bg-blue-900/50 text-blue-300",
        referral: "bg-amber-900/50 text-amber-300",
      };
      return <Badge className={cn("border-transparent capitalize", sourceColors[source] || sourceColors.manual)}>{source}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value === "all" || row.getValue(id) === value;
    },
  },
  {
    accessorKey: "dateAdded",
    header: "Date Added",
    cell: ({ row }) => new Date(row.getValue("dateAdded")).toLocaleDateString(),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const lead = row.original;
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
            <DropdownMenuItem
              onClick={() => onConvert(lead)}
              disabled={lead.status === 'Converted'}
            >
              Convert to Student
            </DropdownMenuItem>
            <DropdownMenuItem>Edit Lead</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
