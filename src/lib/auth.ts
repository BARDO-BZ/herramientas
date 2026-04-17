import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const ALLOWED_DOMAIN = "bardo.bz";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      return !!user.email?.endsWith(`@${ALLOWED_DOMAIN}`);
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});
