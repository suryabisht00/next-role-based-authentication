import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
    const session = await auth();
    return (
        <main className="grow flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-4">
            <Card className="max-w-md w-full backdrop-blur-sm bg-white/80 dark:bg-gray-800 border-none shadow-xl">
                <CardHeader className="text-center space-y-6">
                    <div className="mx-auto relative w-40 h-40 overflow-hidden rounded-2xl">
                        <Image
                            className="object-cover transform hover:scale-110 transition-transform duration-300"
                            src="https://images.pexels.com/photos/1374510/pexels-photo-1374510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                            alt="Welcome Image"
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                    <div className="space-y-2">
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                            Welcome, {session?.user?.name || 'Guest'}!
                        </CardTitle>
                        <p className="text-gray-600 dark:text-gray-300">
                            Experience the next generation of web development with our Next.js application.
                        </p>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 border border-purple-100 dark:border-gray-600">
                            <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">
                                🚀 Modern Tech Stack
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Built with Next.js, Tailwind CSS, and TypeScript for the best development experience.
                            </p>
                        </div>
                        {!session && (
                            <div className="flex gap-3 mt-4">
                                <Button 
                                    asChild
                                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                                >
                                    <Link href="/signin">Sign In</Link>
                                </Button>
                                <Button 
                                    asChild
                                    variant="outline"
                                    className="w-full border-purple-200 hover:bg-purple-50 dark:border-gray-600 dark:hover:bg-gray-700"
                                >
                                    <Link href="/signup">Sign Up</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
