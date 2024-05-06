//next-auth ka poora maamla yaha h

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "naveen" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();

        const user = await UserModel.findOne({
          $or: [
            { email: credentials.email },
            { username: credentials.username },
          ],
        });

        if (!user) {
          throw new Error("No user found!");
        }

        if (!user.isVerified) {
          throw new Error("Verify you account first!");
        }

        const compare = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (compare) {
          return user;
        } else {
          throw new Error("Incorrect email or password!");
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    //called when JSON Web Token is created
    async jwt({ token, user }: any) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },
    //called whenever a session is checked
    async session({ session, token }: any) {
      if (token) {
        session.user._id = token._id?.toString();
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
  },
};
