import { NextResponse } from 'next/server';
import Task from '@/models/task';
import  dbConnect  from '@/lib/connectDB';

export async function GET(req) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const search = url.searchParams.get('search') || '';

    const filter = {};
    if (search) filter.title = { $regex: search, $options: 'i' };

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ tasks });
  } catch (err) {
    return NextResponse.json({ message: 'Failed to fetch tasks', error: err.message }, { status: 500 });
  }
}
