import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email } = body;

    if (!username || !email) {
      return NextResponse.json(
        { error: 'Username and email are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Return existing user if email already registered
      return NextResponse.json(existingUser);
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        username,
        email,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);

    // Handle specific Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'This email is already registered' },
          { status: 409 }
        );
      }
      // Table doesn't exist - migrations haven't run
      if (error.code === 'P2021') {
        return NextResponse.json(
          { error: 'Database tables not found. Please check migrations.' },
          { status: 503 }
        );
      }
      return NextResponse.json(
        { error: `Database error: ${error.code}` },
        { status: 500 }
      );
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json(
        { error: 'Database connection failed. Please check DATABASE_URL.' },
        { status: 503 }
      );
    }

    // Return actual error message in development for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to create user: ${errorMessage}` },
      { status: 500 }
    );
  }
}
