// File: src/app/api/users/[id]/route.js
import dbConnect from '@/lib/connectDB';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
  await dbConnect();
  const id = params.id;

  const { name, userId, password, role } = await req.json();

  const updateData = { name, userId, role };

  if (password && password.trim() !== '') {
    updateData.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

  if (!updatedUser) {
    return new Response('User not found', { status: 404 });
  }

  return Response.json({ success: true, data: updatedUser });
}


export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    await User.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'User deleted' });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
