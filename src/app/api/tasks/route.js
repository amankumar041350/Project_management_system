// File: src/app/api/tasks/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/connectDB';
import Task from '@/models/task';

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);

  const status = searchParams.get('status');
  const search = searchParams.get('search');
  const start = searchParams.get('start');
  const end = searchParams.get('end');

  let query = {};

  if (status) query.status = status;

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  if (start && end) {
    query.assignDate = {
      $gte: new Date(start),
      $lte: new Date(end),
    };
  }

  const tasks = await Task.find(query).sort({ createdAt: -1 });

  return NextResponse.json({ data: tasks });
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();

  const newTask = new Task(body);
  await newTask.save();

  return NextResponse.json({ message: 'Task created' }, { status: 201 });
}
