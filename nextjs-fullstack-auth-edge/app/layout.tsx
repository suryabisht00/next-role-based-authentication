import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { SessionProvider } from "next-auth/react";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Auth js and mongodb template",
    description: "Auth js and mongodb template",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SessionProvider>
            <html lang="en">
                <body className={inter.className}>
                    <Navbar />
                    <div className="pt-20 min-h-screen flex flex-col">
                        {children}
                    </div>
                    <Footer />
                </body>
            </html>
        </SessionProvider>
    );
}
