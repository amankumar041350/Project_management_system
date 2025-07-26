// File: src/app/api/user/edit-profile/route.js

import { getToken } from "next-auth/jwt";
import dbConnect from "@/lib/connectDB";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function PUT(request) {
  await dbConnect();

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }

  const sessionUserId = token.id;

  const { currentPassword, newPassword } = await request.json();

  // 🔐 Basic validation
  if (!currentPassword || !newPassword) {
    return new Response(JSON.stringify({ message: "Both current and new passwords are required" }), {
      status: 400,
    });
  }

  if (newPassword.trim().length < 6) {
    return new Response(JSON.stringify({ message: "New password must be at least 6 characters" }), {
      status: 400,
    });
  }

  try {
    const user = await User.findById(sessionUserId);

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordCorrect) {
      return new Response(JSON.stringify({ message: "Current password is incorrect" }), { status: 403 });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedNewPassword;
    await user.save();

    return new Response(JSON.stringify({ message: "Password updated successfully" }), {
      status: 200,
    });

  } catch (error) {
    console.error("Password Update Error:", error);
    return new Response(JSON.stringify({ message: "Server error", error: error.message }), {
      status: 500,
    });
  }
}
