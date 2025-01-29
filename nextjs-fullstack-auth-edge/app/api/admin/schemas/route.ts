import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const session = await auth();

        // Check if user is authenticated and is an admin
        if (!session || session.user?.role !== 'admin') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // Fetch data from MongoDB collections
        const [users, accounts] = await Promise.all([
            prisma.user.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    isEmailVerified: true,
                    createdAt: true,
                }
            }),
            prisma.account.findMany({
                select: {
                    id: true,
                    userId: true,
                    provider: true,
                    type: true,
                    providerAccountId: true,
                    createdAt: true,
                }
            })
        ]);

        // Define schemas based on your Prisma schema
        const schemas = [
            {
                name: 'User',
                fields: [
                    { name: 'id', type: 'ObjectId', isRequired: true, isUnique: true },
                    { name: 'name', type: 'String', isRequired: false, isUnique: false },
                    { name: 'email', type: 'String', isRequired: true, isUnique: true },
                    { name: 'role', type: 'String', isRequired: true, isUnique: false },
                    { name: 'isEmailVerified', type: 'Boolean', isRequired: true, isUnique: false },
                    { name: 'createdAt', type: 'DateTime', isRequired: true, isUnique: false }
                ],
                data: users
            },
            {
                name: 'Account',
                fields: [
                    { name: 'id', type: 'ObjectId', isRequired: true, isUnique: true },
                    { name: 'userId', type: 'ObjectId', isRequired: true, isUnique: false },
                    { name: 'provider', type: 'String', isRequired: true, isUnique: false },
                    { name: 'type', type: 'String', isRequired: true, isUnique: false },
                    { name: 'providerAccountId', type: 'String', isRequired: true, isUnique: false },
                    { name: 'createdAt', type: 'DateTime', isRequired: true, isUnique: false }
                ],
                data: accounts
            }
        ];

        return NextResponse.json(schemas);
    } catch (error) {
        console.error('Error fetching schemas:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
} 