import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function PATCH(
    request: Request,
    { params }: { params: { userId: string } }
) {
    try {
        const session = await auth();

        // Check if user is authenticated and is an admin
        if (!session || session.user?.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { userId } = params;
        const { newPassword } = await request.json();

        if (!newPassword) {
            return NextResponse.json(
                { error: 'Password is required' },
                { status: 400 }
            );
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        try {
            // Update user password
            await prisma.user.update({
                where: { 
                    id: userId
                },
                data: { 
                    password: hashedPassword
                }
            });

            return NextResponse.json({ success: true });
        } catch (error) {
            console.error('Database error:', error);
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }
    } catch (error) {
        console.error('Error updating password:', error);
        return NextResponse.json(
            { error: 'Failed to update password' },
            { status: 500 }
        );
    }
} 