// app/api/jobs/[id]/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDB';
import Job from '@/models/job';

// GET a single job
export async function GET(request, { params }) {
  await dbConnect();
  const { id } = params;
  try {
    const job = await Job.findById(id);
    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    return NextResponse.json({ data: job });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 });
  }
}

// UPDATE a job
export async function PUT(request, { params }) {
  await dbConnect();
  const { id } = params;
  const body = await request.json();
  try {
    const updated = await Job.findByIdAndUpdate(id, body, { new: true });
    if (!updated) return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    return NextResponse.json({ data: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
  }
}

// DELETE a job (optional)
export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = params;
  try {
    await Job.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
  }
}