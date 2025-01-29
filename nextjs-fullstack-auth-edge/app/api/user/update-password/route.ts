import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { currentPassword, newPassword } = body;

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { id: true, password: true }
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Verify current password if it exists
        if (user.password) {
            if (!currentPassword) {
                return NextResponse.json(
                    { message: "Current password is required" },
                    { status: 400 }
                );
            }

            const isValid = await bcryptjs.compare(currentPassword, user.password);
            if (!isValid) {
                return NextResponse.json(
                    { message: "Current password is incorrect" },
                    { status: 400 }
                );
            }
        }

        // Hash and update new password
        const hashedPassword = await bcryptjs.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });

        return NextResponse.json(
            { message: "Password updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating password:", error);
        return NextResponse.json(
            { message: "Error updating password" },
            { status: 500 }
        );
    }
}
