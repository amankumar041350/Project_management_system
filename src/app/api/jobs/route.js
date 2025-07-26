// app/api/jobs/route.js
import dbConnect from '@/lib/connectDB';
import Job from '@/models/job';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();
  const jobs = await Job.find().sort({ createdAt: -1 });
  return NextResponse.json({ data: jobs });
}


export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const job = await Job.create(body);
    return NextResponse.json({ data: job }, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}
