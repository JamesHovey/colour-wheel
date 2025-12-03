import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const health = {
    status: 'checking',
    database: 'unknown',
    databaseUrl: process.env.DATABASE_URL ? 'configured' : 'missing',
    timestamp: new Date().toISOString(),
  };

  try {
    // Try to connect to the database
    await prisma.$queryRaw`SELECT 1`;
    health.database = 'connected';
    health.status = 'healthy';
  } catch (error) {
    health.database = 'disconnected';
    health.status = 'unhealthy';

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { ...health, error: errorMessage },
      { status: 503 }
    );
  }

  return NextResponse.json(health);
}
