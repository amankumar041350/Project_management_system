import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDB';
import Project from '@/models/Project';

export async function GET() {
  await dbConnect();
  const projects = await Project.find().sort({ createdAt: -1 });
  return NextResponse.json({ success: true, data: projects });
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();

  try {
    const project = await Project.create(body);
    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
