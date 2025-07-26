import { NextResponse } from 'next/server';
import Project from '@/models/Project';
import dbConnect  from '@/lib/connectDB';

export async function GET(req) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const search = url.searchParams.get('search') || '';

    const filter = {};
    if (search) filter.projectTitle = { $regex: search, $options: 'i' };

    const projects = await Project.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ projects });
  } catch (err) {
    return NextResponse.json({ message: 'Failed to fetch projects', error: err.message }, { status: 500 });
  }
}
