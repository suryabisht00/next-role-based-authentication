"use client";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updatePasswordSchema, updateProfileSchema } from "@/lib/zod";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ErrorMessage from "@/components/error-message";
import { useRouter } from "next/navigation";
import { UserCircle, Mail, Lock, Camera, Shield, CheckCircle2, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster, toast } from "sonner";

export default function ProfilePage() {
    const { data: session, status, update } = useSession({
        required: true,
        onUnauthenticated() {
            window.location.href = '/signin';
        },
    });
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const profileForm = useForm<z.infer<typeof updateProfileSchema>>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            name: "",
            email: "",
        },
    });

    const passwordForm = useForm<z.infer<typeof updatePasswordSchema>>({
        resolver: zodResolver(updatePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        },
    });

    // Reset form when session changes
    useEffect(() => {
        if (session?.user) {
            profileForm.reset({
                name: session.user.name || "",
                email: session.user.email || "",
            });
        }
    }, [session, profileForm]);

    const onProfileSubmit = async (values: z.infer<typeof updateProfileSchema>) => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/user/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (response.ok) {
                await update({
                    ...session,
                    user: {
                        ...session?.user,
                        name: values.name,
                        email: values.email,
                    }
                });
                toast.success("Profile updated successfully");
                router.refresh();
            } else {
                toast.error(data.message || "Something went wrong");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const onPasswordSubmit = async (values: z.infer<typeof updatePasswordSchema>) => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/user/update-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (response.ok) {
                passwordForm.reset();
                await update({
                    ...session,
                    user: {
                        ...session?.user,
                        hasPassword: true
                    }
                });
                toast.success("Password updated successfully");
                router.refresh();
            } else {
                toast.error(data.message || "Something went wrong");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    if (status === "loading") {
        return <div className="container mx-auto p-4">Loading...</div>;
    }

    return (
        <div className="container max-w-6xl mx-auto p-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Profile Settings</h1>
                <p className="text-muted-foreground">Manage your account settings and preferences.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-12">
                {/* Sidebar */}
                <Card className="md:col-span-4 bg-muted/50">
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                                    <UserCircle className="w-12 h-12 text-primary" />
                                </div>
                                <Button 
                                    size="icon" 
                                    variant="outline" 
                                    className="absolute bottom-0 right-0 rounded-full"
                                >
                                    <Camera className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="text-center">
                                <h2 className="text-xl font-semibold">{session.user.name || "User"}</h2>
                                <p className="text-sm text-muted-foreground">{session.user.email}</p>
                            </div>
                            <div className="w-full pt-4">
                                <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5">
                                    <Shield className="w-4 h-4 text-primary" />
                                    <span className="text-sm">Account Status:</span>
                                    <span className="text-sm font-medium ml-auto flex items-center gap-1">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        Active
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content */}
                <div className="md:col-span-8">
                    <Tabs defaultValue="profile" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="profile" className="flex items-center gap-2">
                                <UserCircle className="w-4 h-4" />
                                Profile
                            </TabsTrigger>
                            <TabsTrigger value="security" className="flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                Security
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="profile">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Profile Information</CardTitle>
                                    <CardDescription>
                                        Update your personal information and email address.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Form {...profileForm}>
                                        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                                            <FormField
                                                control={profileForm.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Name</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <UserCircle className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                                                <Input {...field} className="pl-10" placeholder="Enter your name" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={profileForm.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Email</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                                                <Input {...field} className="pl-10" type="email" placeholder="Enter your email" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <div className="flex justify-end">
                                                <Button 
                                                    type="submit" 
                                                    disabled={isLoading}
                                                    className="min-w-[120px]"
                                                >
                                                    {isLoading ? "Saving..." : "Save Changes"}
                                                </Button>
                                            </div>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="security">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Security Settings</CardTitle>
                                    <CardDescription>
                                        Update your password and security preferences.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Form {...passwordForm}>
                                        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                                            {session?.user?.hasPassword && (
                                                <FormField
                                                    control={passwordForm.control}
                                                    name="currentPassword"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Current Password</FormLabel>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                                                    <Input {...field} className="pl-10" type="password" />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            )}
                                            <FormField
                                                control={passwordForm.control}
                                                name="newPassword"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>New Password</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                                                <Input {...field} className="pl-10" type="password" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={passwordForm.control}
                                                name="confirmNewPassword"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Confirm Password</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                                                <Input {...field} className="pl-10" type="password" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <div className="flex justify-end">
                                                <Button 
                                                    type="submit" 
                                                    disabled={isLoading}
                                                    className="min-w-[120px]"
                                                >
                                                    {isLoading ? "Updating..." : "Update Password"}
                                                </Button>
                                            </div>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
            <Toaster position="top-center" />
        </div>
    );
}
