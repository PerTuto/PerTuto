"use client";

import { useEffect, useState, useCallback } from "react";
import { AddUserDialog } from "@/components/tenant/add-user-dialog";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { UserProfile } from "@/lib/firebase/services";
import { useAuth } from "@/hooks/use-auth";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore"; // Use client SDK for reading
import { firestore } from "@/lib/firebase/client-app";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

type TenantUser = UserProfile & {
    id: string;
    status?: string;
    createdAt?: any
};

export default function OrganizationUsersPage() {
    const [users, setUsers] = useState<TenantUser[]>([]);
    const [loading, setLoading] = useState(true);
    const { userProfile } = useAuth();

    const fetchUsers = useCallback(async () => {
        if (!userProfile?.tenantId) return;
        setLoading(true);
        try {
            // Read from tenant sub-collection
            const q = query(collection(firestore, `tenants/${userProfile.tenantId}/users`));
            const snapshot = await getDocs(q);
            const fetchedUsers: TenantUser[] = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                fetchedUsers.push({ id: doc.id, ...data } as TenantUser);
            });
            setUsers(fetchedUsers);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    }, [userProfile]);

    useEffect(() => {
        if (userProfile?.tenantId) {
            fetchUsers();
        }
    }, [userProfile, fetchUsers]);


    const columns: ColumnDef<TenantUser>[] = [
        {
            accessorKey: "fullName",
            header: "Name",
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "role",
            header: "Role",
            cell: ({ row }) => {
                const role = row.getValue("role");
                if (Array.isArray(role)) {
                    return (
                        <div className="flex gap-1">
                            {role.map(r => (
                                <Badge key={r} variant={r === 'admin' ? 'default' : 'secondary'}>
                                    {r}
                                </Badge>
                            ))}
                        </div>
                    );
                }
                const roleStr = role as string;
                return (
                    <Badge variant={roleStr === 'admin' ? 'default' : 'secondary'}>
                        {roleStr}
                    </Badge>
                )
            }
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                return row.original.status || 'Active';
            }
        },
        {
            accessorKey: "createdAt",
            header: "Joined",
            cell: ({ row }) => {
                // Handle Firestore Timestamp or Date
                const dateVal = row.original.createdAt;
                if (!dateVal) return "-";
                const date = dateVal instanceof Timestamp ? dateVal.toDate() : new Date(dateVal);
                return format(date, "MMM d, yyyy");
            }
        },
    ];

    if (!userProfile?.tenantId) {
        return <div>Please log in to view your organization.</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Organization Users</h2>
            </div>

            <DataTable
                columns={columns}
                data={users}
                filterColumn="email"
                addEntityContext={{
                    addLabel: "Add User",
                    dialogTitle: "Add New User",
                    dialogDescription: "Create a new user for your organization.",
                    dialogContent: <AddUserDialog onUserAdded={fetchUsers} />
                }}
            />
        </div>
    );
}
