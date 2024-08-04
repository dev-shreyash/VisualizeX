import { NextAuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from 'bcryptjs';
import { signInSchema } from "@/schemas/signInSchema";
import { db } from "@/app/lib/database/database";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Email/Username', type: 'text' }, // match the name
        password: { label: 'Password', type: 'password' },     // match the name
      },
      async authorize(credentials: any): Promise<any> {
        console.time('authorize')
        try {
          const parsedCredentials = signInSchema.parse(credentials);
          const user = await db.user.findFirst({
            where: {
              OR: [
                { email: parsedCredentials.identifier },
                { username: parsedCredentials.identifier },
              ],
            },
          });

          console.timeLog('authorize', 'User query executed');

          if (!user || !user.password) {
            throw new Error('No user found with this email or username');
          }

          const isPasswordCorrect = await bcrypt.compare(
            parsedCredentials.password,
            user.password
          );

          console.timeLog('authorize', 'Password comparison executed');

          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error('Incorrect password');
          }
        } catch (err: any) {
          console.error('Error in authorize:', err);
          throw new Error(err.message || 'Authentication failed');
        } finally {
          console.timeEnd('authorize');
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  debug: true,
  adapter: PrismaAdapter(db),
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/sign-in',
  },
};
