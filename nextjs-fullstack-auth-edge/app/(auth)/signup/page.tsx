"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/loading-button";
import ErrorMessage from "@/components/error-message";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUpSchema } from "@/lib/zod";
import {
    handleCredentialsSignin,
    handleSignUp,
} from "@/app/actions/authActions";
import { UserPlus, User, Mail, Lock } from "lucide-react";

export default function SignUp() {
    const [globalError, setGlobalError] = useState("");

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
        try {
            const result: ServerActionResponse = await handleSignUp(values);
            if (result.success) {
                console.log("Account created successfully.");
                const valuesForSignin = {
                    email: values.email,
                    password: values.password,
                };
                await handleCredentialsSignin(valuesForSignin);
            } else {
                setGlobalError(result.message);
            }
        } catch (error) {
            setGlobalError("An unexpected error occurred. Please try again.");
        }
    };

    return (
        <div className="grow flex items-center justify-center p-4 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 min-h-screen">
            <Card className="w-full max-w-md backdrop-blur-sm bg-white/90 dark:bg-gray-800 shadow-xl border-none">
                <CardHeader className="space-y-6 text-center">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <UserPlus className="h-8 w-8 text-white" />
                    </div>
                    <div className="space-y-2">
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                            Create Account
                        </CardTitle>
                        <p className="text-gray-500 dark:text-gray-300">Join us and start your journey</p>
                    </div>
                </CardHeader>
                <CardContent>
                    {globalError && <ErrorMessage error={globalError} />}
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            {[
                                "name",
                                "email",
                                "password",
                                "confirmPassword",
                            ].map((field) => (
                                <FormField
                                    control={form.control}
                                    key={field}
                                    name={field as keyof z.infer<typeof signUpSchema>}
                                    render={({ field: fieldProps }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 dark:text-gray-300">
                                                {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    {field === 'name' && <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />}
                                                    {field === 'email' && <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />}
                                                    {field.includes('password') && <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />}
                                                    <Input
                                                        type={field.includes("password") ? "password" : field === "email" ? "email" : "text"}
                                                        placeholder={`Enter your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                                                        className="pl-10 bg-white/50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-400"
                                                        {...fieldProps}
                                                        autoComplete="off"
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                            <LoadingButton
                                pending={form.formState.isSubmitting}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                            >
                                Create Account
                            </LoadingButton>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
