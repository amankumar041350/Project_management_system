// File: src/app/api/users/route.js
import dbConnect from '@/lib/connectDB';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET(req) {
  try {
    await dbConnect();
    const { search } = Object.fromEntries(new URL(req.url).searchParams);

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { userId: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const users = await User.find(query).select('-password');
    return Response.json({ success: true, data: users });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(req) {
  
  try {
    await dbConnect();
    const { name, userId, password, role } = await req.json();
    console.log(name,userId,password,role)

    if (!name || !userId || !password || !role) {
      return new Response('All fields are required', { status: 400 });
    }

    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return new Response('User already exists', { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, userId, password: hashedPassword, role });
    console.log(newUser)
    await newUser.save();

    return Response.json({ success: true, message: 'User created' });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}