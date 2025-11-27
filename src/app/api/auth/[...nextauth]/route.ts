import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { userRepository } from "@/lib/repositories/UserRepository"

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: "openid email profile https://www.googleapis.com/auth/calendar",
                },
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (!user.email) return false;
            const existingUser = await userRepository.getUserByEmail(user.email);
            return !!existingUser;
        },
        async jwt({ token, account, user }) {
            if (account) {
                token.accessToken = account.access_token;
            }
            if (user) {
                const dbUser = await userRepository.getUserByEmail(user.email!);
                if (dbUser) {
                    token.sub = dbUser.id;
                    token.role = dbUser.role;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub!;
                // @ts-ignore
                session.user.role = token.role;
                // @ts-ignore
                session.accessToken = token.accessToken;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
