import { NextAuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from 'bcryptjs';
import { signInSchema, SignInSchema } from "@/schemas/signInSchema";
import { signUpSchema, SignUpSchema } from "@/schemas/signUpSchema";
import { z } from 'zod';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any): Promise<any> {
        try {
            const parsedCredentials = signInSchema.parse(credentials);
            const user = await prisma.user.findUnique({
              where: { email: parsedCredentials.identifier },
            });
  
            if (!user || !user.password) {
              throw new Error('No user found with this email or username');
            }
  
            const isPasswordCorrect = await bcrypt.compare(
              parsedCredentials.password,
              user.password
            );
  
            if (isPasswordCorrect) {
              return user;
            } else {
              throw new Error('Incorrect password');
            }
        } catch (err: any) {
          console.error('Error in authorize:', err);
          throw new Error(err.message);
        }
      },
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
  adapter: PrismaAdapter(prisma),
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