import Task from '@/models/task';
import dbConnect from '@/lib/connectDB';
import { NextResponse } from 'next/server';

// ✅ Get task by ID
export async function GET(request, { params }) {
  await dbConnect();
  const { id } = await params;

  try {
    const task = await Task.findById(id);
    if (!task) return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    return NextResponse.json({ data: task });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ Update task by ID
export async function PUT(request, { params }) {
  await dbConnect();
  const { id } = await params;

  try {
    const data = await request.json();
    const updated = await Task.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json({ message: 'Task updated', data: updated });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ Delete task by ID
export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = await params;

  try {
    await Task.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Task deleted' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
