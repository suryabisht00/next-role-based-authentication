import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { name, email } = await request.json();

        // Check if email is already taken
        if (email) {
            const existingUser = await prisma.user.findFirst({
                where: {
                    email,
                    NOT: {
                        id: session.user.id
                    }
                }
            });

            if (existingUser) {
                return NextResponse.json(
                    { message: "Email already in use" },
                    { status: 400 }
                );
            }
        }

        // Update user profile
        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                ...(name && { name }),
                ...(email && { email }),
            },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                role: true
            }
        });

        return NextResponse.json({
            message: "Profile updated successfully",
            user: {
                ...updatedUser,
                hasPassword: !!updatedUser.password,
                password: undefined
            }
        }, { status: 200 });
    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json(
            { message: "Error updating profile" },
            { status: 500 }
        );
    }
} 