"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { z } from "zod";
import { signInSchema, signUpSchema } from "@/lib/zod";
import bcryptjs from "bcryptjs";
import prisma from "@/lib/prisma";

export async function handleCredentialsSignin(formData: z.infer<typeof signInSchema>) {
    try {
        await signIn("credentials", {
            email: formData.email,
            password: formData.password,
            redirectTo: "/"
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { message: "Invalid credentials" };
                default:
                    return { message: "Something went wrong" };
            }
        }
        throw error;
    }
}

export async function handleGithubSignin() {
    await signIn("github", { redirectTo: "/" });
}

export async function handleSignOut() {
    await signOut({ redirectTo: "/signin" });
}

export async function handleSignUp(formData: z.infer<typeof signUpSchema>) {
    try {
        const { name, email, password } = formData;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { success: false, message: "Email already exists" };
        }

        // Hash password and create user
        const hashedPassword = await bcryptjs.hash(password, 10);
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return { success: true, message: "Account created successfully" };
    } catch (error) {
        console.error("Error in handleSignUp:", error);
        return { success: false, message: "Something went wrong" };
    }
}