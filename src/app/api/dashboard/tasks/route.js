import { NextResponse } from 'next/server';
import Task from '@/models/task';
import  dbConnect  from '@/lib/connectDB';

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'pending';
    const search = searchParams.get('search') || '';

    const query = {};
    if (status !== 'all') query.status = status;
    if (search) query.title = { $regex: search, $options: 'i' };

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ tasks });
  } catch (err) {
    return NextResponse.json({ message: 'Failed to fetch tasks' }, { status: 500 });
  }
}
