"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Invoice, InvoiceStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, FileText, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const columns: ColumnDef<Invoice & { studentName?: string }>[] = [
  {
    accessorKey: "id",
    header: "Invoice ID",
    cell: ({ row }) => <span className="font-mono text-xs">{row.original.id.substring(0, 8)}...</span>,
  },
  {
    accessorKey: "studentName",
    header: "Student",
    cell: ({ row }) => <span className="font-medium">{row.original.studentName || 'Unknown Student'}</span>,
  },
  {
    accessorKey: "issueDate",
    header: "Issued",
    cell: ({ row }) => {
      const date = row.getValue("issueDate") as Date;
      return <div className="text-muted-foreground">{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalAmount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "balanceDue",
    header: "Balance",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("balanceDue"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="font-medium text-destructive">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as InvoiceStatus;
      
      let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
      if (status === InvoiceStatus.Paid) variant = "default";
      if (status === InvoiceStatus.Overdue) variant = "destructive";
      if (status === InvoiceStatus.Unpaid) variant = "secondary";

      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const invoice = row.original;

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(invoice.id)}>
              Copy Invoice ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <FileText className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            {invoice.balanceDue > 0 && (
              <DropdownMenuItem 
                className="text-primary focus:text-primary"
                onClick={() => {
                  // Dispatch custom event to open payment dialog
                  const event = new CustomEvent('openPaymentDialog', { detail: invoice });
                  window.dispatchEvent(event);
                }}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Record Payment
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
