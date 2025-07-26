import { getToken } from "next-auth/jwt";
import dbConnect from "@/lib/connectDB";
import Task from "@/models/task";

const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req) {
  const token = await getToken({ req, secret });

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    // If you want to filter tasks assigned to the current user:
    const userId = token.userId;
   
    const tasks = await Task.find({
      status: 'pending',
     
    }).sort({ deadline: 1 });
    console.log(tasks)

    return Response.json({ tasks }, { status: 200 });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
