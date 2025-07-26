import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDB';
import Project from '@/models/Project';

export async function DELETE(req, { params }) {
  await dbConnect();
  const { id } = params;

  try {
    await Project.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
export async function PUT(req, { params }) {
  await dbConnect();

  const { id } = params;
  const body = await req.json();

  try {
    const updated = await Project.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return Response.json({ error: 'Project not found' }, { status: 404 });
    }

    return Response.json({ message: 'Project updated successfully', project: updated }, { status: 200 });
  } catch (error) {
    console.error('Error updating project:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  await dbConnect();

  const { id } = await params;

  try {
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    return NextResponse.json( project , { status: 200 });
  } catch (error) {
    console.error('GET Project Error:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}