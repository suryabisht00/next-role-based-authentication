"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserCircle, LogOut, Home, Settings, Shield } from "lucide-react";
import { handleSignOut } from "@/app/actions/authActions";

interface MobileMenuProps {
    session: any;
    isAdmin: boolean;
}

export default function MobileMenu({ session, isAdmin }: MobileMenuProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const closeMenu = () => setIsMobileMenuOpen(false);

    return (
        <div className="flex items-center">
            {/* Mobile Menu Button */}
            <button 
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                </svg>
            </button>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="absolute top-16 right-0 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 flex flex-col items-start gap-2 mt-2">
                    {!session ? (
                        // Auth buttons for non-authenticated users
                        <>
                            <Button 
                                asChild 
                                variant="ghost"
                                className="font-medium hover:bg-purple-50 hover:text-purple-600"
                                onClick={closeMenu}
                            >
                                <Link href="/signin">Sign In</Link>
                            </Button>
                            <Button 
                                asChild
                                className="font-medium bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                                onClick={closeMenu}
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
                                    onClick={closeMenu}
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
                                onClick={closeMenu}
                            >
                                <Link href="/profile">
                                    <UserCircle className="w-4 h-4" />
                                    <span>{session.user.name || 'Profile'}</span>
                                </Link>
                            </Button>

                            {/* Settings Link */}
                            <Button 
                                asChild 
                                variant="ghost"
                                className="flex items-center gap-2 font-medium hover:bg-purple-50 hover:text-purple-600"
                                onClick={closeMenu}
                            >
                                <Link href="/profile">
                                    <Settings className="w-4 h-4" />
                                </Link>
                            </Button>

                            {/* Sign Out Button */}
                            <form action={handleSignOut}>
                                <Button 
                                    variant="ghost" 
                                    type="submit"
                                    className="flex items-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                                    onClick={closeMenu}
                                >
                                    <LogOut className="w-4 h-4" />
                                </Button>
                            </form>
                        </>
                    )}
                </div>
            )}
        </div>
    );
} 