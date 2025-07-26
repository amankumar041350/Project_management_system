import { getToken } from "next-auth/jwt";
import dbConnect from "@/lib/connectDB";
import Task from "@/models/task";

const secret = process.env.NEXTAUTH_SECRET;

export async function PUT(req) {
     
  const token = await getToken({ req, secret });
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const cuser =token.name
  console.log(cuser)
  const { taskId } = await req.json();

  await dbConnect();
    
  const task = await Task.findById(taskId);
  if (!task) return Response.json({ error: "Task not found" }, { status: 404 });

  task.status = "completed";
  await task.save();
  task.completedBy = cuser
  await task.save();

  return Response.json({ message: "Task marked as completed" }, { status: 200 });
}
