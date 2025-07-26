import { getToken } from "next-auth/jwt";
import dbConnect from "@/lib/connectDB";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const secret = process.env.NEXTAUTH_SECRET;

export async function POST(req) {
  const token = await getToken({ req, secret });

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  await dbConnect();

  // Assuming token contains userId
  const user = await User.findOne({ userId: token.userId });
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return Response.json({ error: "Current password is incorrect" }, { status: 403 });
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedNewPassword;
  await user.save();

  return Response.json({ message: "Password updated successfully" }, { status: 200 });
}
