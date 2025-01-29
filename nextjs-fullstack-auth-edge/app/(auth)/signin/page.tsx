"use client";

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

import { GitHubLogoIcon } from "@radix-ui/react-icons";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { signInSchema } from "@/lib/zod";
import LoadingButton from "@/components/loading-button";
import {
    handleCredentialsSignin,
    handleGithubSignin,
} from "@/app/actions/authActions";
import { useState, useEffect } from "react";
import ErrorMessage from "@/components/error-message";
import { Button } from "@/components/ui/button";

import { useRouter, useSearchParams } from "next/navigation";
import { LockKeyhole, Mail, Lock } from "lucide-react";

export default function SignInPage() {
    const params = useSearchParams();
    const error = params.get("error");
    const router = useRouter();

    const [globalError, setGlobalError] = useState<string>("");

    useEffect(() => {
        if (error) {
            switch (error) {
                case "OAuthAccountNotLinked":
                    setGlobalError(
                        "Please use your email and password to sign in."
                    );
                    break;
                default:
                    setGlobalError(
                        "An unexpected error occurred. Please try again."
                    );
            }
        }
        router.replace("/signin");
    }, [error, router]);

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof signInSchema>) => {
        setGlobalError("");
        const result = await handleCredentialsSignin(values);
        if (result?.message) {
            setGlobalError(result.message);
        }
    };

    return (
        <div className="grow flex items-center justify-center p-4 bg-gradient-to-br from-purple-100 via-indigo-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 min-h-screen">
            <Card className="w-full max-w-md backdrop-blur-sm bg-white/90 dark:bg-gray-800 shadow-xl border-none">
                <CardHeader className="space-y-6 text-center">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                        <LockKeyhole className="h-8 w-8 text-white" />
                    </div>
                    <div className="space-y-2">
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
                            Welcome Back
                        </CardTitle>
                        <p className="text-gray-500 dark:text-gray-300">Sign in to your account to continue</p>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {globalError && <ErrorMessage error={globalError} />}
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 dark:text-gray-300">Email</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                                <Input
                                                    type="email"
                                                    placeholder="Enter your email address"
                                                    className="pl-10 bg-white/50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-purple-400 focus:ring-purple-400"
                                                    autoComplete="off"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 dark:text-gray-300">Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                                <Input
                                                    type="password"
                                                    placeholder="Enter password"
                                                    className="pl-10 bg-white/50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-purple-400 focus:ring-purple-400"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <LoadingButton
                                pending={form.formState.isSubmitting} 
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                            >
                                Sign in
                            </LoadingButton>
                        </form>
                    </Form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-200 dark:border-gray-600" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-300">or continue with</span>
                        </div>
                    </div>

                    <form className="w-full" action={handleGithubSignin}>
                        <Button
                            variant="outline"
                            className="w-full border-gray-200 dark:border-gray-600 hover:bg-gray-50/50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                            type="submit"
                        >
                            <GitHubLogoIcon className="h-4 w-4 mr-2" />
                            Sign in with GitHub
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
