import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { handleSignOut } from "@/app/actions/authActions";
import { UserCircle, LogOut, Home, Settings, Shield } from "lucide-react";
import DarkModeToggle from "@/components/ui/DarkModeToggle";
import MobileMenu from "@/components/ui/MobileMenu";

export default async function Navbar() {
    const session = await auth();
    const isAdmin = session?.user?.role === 'admin';

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo/Home */}
                    <Link 
                        href="/" 
                        className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text hover:opacity-80 transition-opacity"
                    >
                        <Home className="w-5 h-5 text-purple-600" />
                        <span>Auth.js</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-2">
                        {/* Dark Mode Toggle Button */}
                        <DarkModeToggle />

                        {/* Mobile Menu - Hidden on larger screens */}
                        <div className="sm:hidden">
                            <MobileMenu session={session} isAdmin={isAdmin} />
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden sm:flex items-center gap-2">
                            {!session ? (
                                // Auth buttons for non-authenticated users
                                <>
                                    <Button 
                                        asChild 
                                        variant="ghost"
                                        className="font-medium hover:bg-purple-50 hover:text-purple-600"
                                    >
                                        <Link href="/signin">Sign In</Link>
                                    </Button>
                                    <Button 
                                        asChild
                                        className="font-medium bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                                    >
                                        <Link href="/signup">Sign Up</Link>
                                    </Button>
                                </>
                            ) : (
                                // User menu for authenticated users
                                <>
                                    {/* Admin Link - Only visible to admin users */}
                                    {isAdmin && (
                                        <Button 
                                            asChild 
                                            variant="ghost"
                                            className="flex items-center gap-2 font-medium hover:bg-purple-50 hover:text-purple-600"
                                        >
                                            <Link href="/admin">
                                                <Shield className="w-4 h-4" />
                                                <span>Admin</span>
                                            </Link>
                                        </Button>
                                    )}
                                    
                                    {/* Profile Link */}
                                    <Button 
                                        asChild 
                                        variant="ghost"
                                        className="flex items-center gap-2 font-medium hover:bg-purple-50 hover:text-purple-600"
                                    >
                                        <Link href="/profile">
                                            <UserCircle className="w-4 h-4" />
                                            <span>{session.user.name || 'Profile'}</span>
                                        </Link>
                                    </Button>

                                    {/* Settings Link */}
                                    {/* <Button 
                                        asChild 
                                        variant="ghost"
                                        className="flex items-center gap-2 font-medium hover:bg-purple-50 hover:text-purple-600"
                                    >
                                        <Link href="/profile">
                                            <Settings className="w-4 h-4" />
                                        </Link>
                                    </Button> */}

                                    {/* Sign Out Button */}
                                    <form action={handleSignOut}>
                                        <Button 
                                            variant="ghost" 
                                            type="submit"
                                            className="flex items-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                                        >
                                            <LogOut className="w-4 h-4" />
                                        </Button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
