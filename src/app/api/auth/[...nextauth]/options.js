import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/connectDB";
import User from "@/models/User";

export const authOptions = {
  providers: [
    CredentialsProvider({

      name: "Credentials",
      credentials: {
        userId: { label: "User ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();

        const user = await User.findOne({ userId: credentials.userId });

        if (!user) throw new Error("No user found with this User ID");

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Incorrect password");
        return {
          id: user._id.toString(),    
          name: user.name,
          userId: user.userId,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 12
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.userId = user.userId;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name,
        userId: token.userId,
        role: token.role,
      };
      return session;


    },
  },
  pages: {
    signIn: "/login",

  },
  secret: process.env.NEXTAUTH_SECRET,
};
