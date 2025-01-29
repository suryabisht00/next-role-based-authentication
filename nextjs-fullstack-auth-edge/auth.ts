import NextAuth from "next-auth";
import prisma from "./lib/prisma";

import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";

// Explicitly cast the adapter to the expected type
export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma) as unknown as import("next-auth/adapters").Adapter,
    session: {
        strategy: "jwt",
    },
    ...authConfig
})