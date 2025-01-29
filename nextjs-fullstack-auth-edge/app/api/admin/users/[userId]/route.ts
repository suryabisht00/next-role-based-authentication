import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function PATCH(
    request: Request,
    { params }: { params: { userId: string } }
) {
    try {
        const session = await auth();

        // Check if user is authenticated and is an admin
        if (!session || session.user?.role !== 'admin') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { userId } = params;
        const body = await request.json();
        const { role } = body;

        // Update user role
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { userId: string } }
) {
    try {
        const session = await auth();

        // Check if user is authenticated and is an admin
        if (!session || session.user?.role !== 'admin') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { userId } = params;

        // Delete user
        await prisma.user.delete({
            where: { id: userId },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('Error deleting user:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
} 