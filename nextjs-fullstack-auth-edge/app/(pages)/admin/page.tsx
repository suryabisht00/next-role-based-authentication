'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Trash2, Shield, Search, UserPlus, RefreshCw, Database, Key, Users } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { UserFilters } from '@/components/admin';
import { UserTable } from '@/components/admin/UserTable';
import { EditUserDialog } from '@/components/admin/EditUserDialog';
import { PasswordDialog } from '@/components/admin/PasswordDialog';
import { DatabaseCollections } from '@/components/admin/DatabaseCollections';
import { SchemaField ,User, DatabaseSchema } from '@/components/admin/types';
import { Loading, LoadingScreen } from '@/components/ui/loading';

// Add password schema
const updatePasswordSchema = z.object({
    newPassword: z.string()
        .min(8, "Password must be more than 8 characters")
        .max(32, "Password must be less than 32 characters"),
    confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState<string>('all');
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [schemas, setSchemas] = useState<DatabaseSchema[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isUsersLoading, setIsUsersLoading] = useState(false);
    const [isSchemasLoading, setIsSchemasLoading] = useState(false);

    // Update the access control useEffect
    useEffect(() => {
        const initializeAdmin = async () => {
            if (status === 'loading') return;
            
            if (!session || session.user?.role !== 'admin') {
                router.push('/');
                return;
            }

            setIsInitialLoading(true);
            try {
                await Promise.all([fetchUsers(), fetchSchemas()]);
            } catch (error) {
                console.error('Failed to initialize admin panel:', error);
                toast.error('Failed to load admin panel');
            } finally {
                setIsInitialLoading(false);
            }
        };

        initializeAdmin();
    }, [session, status]);

    // Fetch users data
    const fetchUsers = async () => {
        setIsUsersLoading(true);
        try {
            const response = await fetch('/api/admin/users');
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            toast.error('Failed to load users');
        } finally {
            setIsUsersLoading(false);
        }
    };

    // Fetch database schemas
    const fetchSchemas = async () => {
        setIsSchemasLoading(true);
        try {
            const response = await fetch('/api/admin/schemas');
            if (!response.ok) throw new Error('Failed to fetch schemas');
            const data = await response.json();
            setSchemas(data);
        } catch (error) {
            toast.error('Failed to load database schemas');
        } finally {
            setIsSchemasLoading(false);
        }
    };

    // Filter users based on search and role
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = selectedRole === 'all' || user.role === selectedRole;
        return matchesSearch && matchesRole;
    });

    // Update user role
    const handleUpdateUser = async (userId: string, newRole: string) => {
        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole }),
            });

            if (!response.ok) throw new Error('Failed to update user');
            
            toast.success('User updated successfully');
            fetchUsers(); // Refresh the list
            setIsEditDialogOpen(false);
        } catch (error) {
            toast.error('Failed to update user');
        }
    };

    // Add this function to handle opening the password dialog
    const handlePasswordClick = (user: User) => {
        setSelectedUser(user);
        setIsPasswordDialogOpen(true);
    };

    // Update the handleUpdatePassword function
    const handleUpdatePassword = async (userId: string, newPassword: string) => {
        try {
            const response = await fetch(`/api/admin/users/${userId}/password`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update password');
            }
            
            toast.success('Password updated successfully');
            setIsPasswordDialogOpen(false);
            await fetchUsers(); // Refresh the users list
        } catch (error) {
            console.error('Password update error:', error);
            const message = error instanceof Error ? error.message : 'Failed to update password';
            toast.error(message);
            throw error;
        }
    };

    // Delete user
    const handleDeleteUser = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete user');
            
            toast.success('User deleted successfully');
            fetchUsers(); // Refresh the list
        } catch (error) {
            toast.error('Failed to delete user');
        }
    };

    // Add after handleDeleteUser function
    const handleEditRecord = (schemaName: string, record: any) => {
        // TODO: Implement record editing
        toast.info('Edit functionality coming soon');
    };

    const handleDeleteRecord = async (schemaName: string, recordId: string) => {
        if (!confirm('Are you sure you want to delete this record?')) return;
        
        try {
            const response = await fetch(`/api/admin/${schemaName.toLowerCase()}/${recordId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete record');
            
            toast.success('Record deleted successfully');
            fetchSchemas(); // Refresh the data
        } catch (error) {
            toast.error('Failed to delete record');
        }
    };

    // Show loading spinner during initial load or authentication check
    if (status === 'loading' || isInitialLoading) {
        return <LoadingScreen />;
    }

    // Redirect if not admin (this will be quick since we already checked in useEffect)
    if (!session || session.user?.role !== 'admin') {
        return null;
    }

    return (
        <div className="container mx-auto p-6 space-y-6 pt-20">
            <Tabs defaultValue="users" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="users" className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Users
                    </TabsTrigger>
                    <TabsTrigger value="schemas" className="flex items-center gap-2">
                        <Database className="w-4 h-4" />
                        Database Collections
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="users">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-2xl flex items-center gap-2">
                                        <Shield className="w-6 h-6 text-purple-600" />
                                        Admin Dashboard
                                    </CardTitle>
                                    <CardDescription>
                                        Manage users and their roles
                                    </CardDescription>
                                </div>
                                <Button
                                    onClick={fetchUsers}
                                    variant="outline"
                                    size="icon"
                                    className="hover:bg-purple-50"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <UserFilters
                                searchTerm={searchTerm}
                                onSearchChange={setSearchTerm}
                                selectedRole={selectedRole}
                                onRoleChange={setSelectedRole}
                            />
                            {isUsersLoading ? (
                                <div className="flex justify-center py-8">
                                    <RefreshCw className="w-6 h-6 animate-spin text-purple-600" />
                                </div>
                            ) : (
                                <UserTable
                                    users={filteredUsers}
                                    onEdit={(user) => {
                                        setEditingUser(user);
                                        setIsEditDialogOpen(true);
                                    }}
                                    onDelete={handleDeleteUser}
                                    onPasswordChange={handlePasswordClick}
                                />
                            )}
                        </CardContent>
                    </Card>

                    <EditUserDialog
                        user={editingUser}
                        open={isEditDialogOpen}
                        onOpenChange={setIsEditDialogOpen}
                        onUpdateRole={handleUpdateUser}
                    />

                    <PasswordDialog
                        user={selectedUser}
                        open={isPasswordDialogOpen}
                        onOpenChange={setIsPasswordDialogOpen}
                        onUpdatePassword={handleUpdatePassword}
                    />
                </TabsContent>

                <TabsContent value="schemas">
                    {isSchemasLoading ? (
                        <div className="flex justify-center py-8">
                            <RefreshCw className="w-6 h-6 animate-spin text-purple-600" />
                        </div>
                    ) : (
                        <DatabaseCollections
                            schemas={schemas}
                            onRefresh={fetchSchemas}
                            onEditRecord={handleEditRecord}
                            onDeleteRecord={handleDeleteRecord}
                        />
                    )}
                </TabsContent>
            </Tabs>
            <Toaster position="top-center" />
        </div>
    );
}
