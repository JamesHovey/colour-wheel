import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const resultId = parseInt(id, 10);

    if (isNaN(resultId)) {
      return NextResponse.json(
        { error: 'Invalid result ID' },
        { status: 400 }
      );
    }

    const result = await prisma.result.findUnique({
      where: { id: resultId },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!result) {
      return NextResponse.json(
        { error: 'Result not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: result.id,
      username: result.user.username,
      redScore: result.redScore,
      yellowScore: result.yellowScore,
      blueScore: result.blueScore,
      greenScore: result.greenScore,
      redPercent: result.redPercent,
      yellowPercent: result.yellowPercent,
      bluePercent: result.bluePercent,
      greenPercent: result.greenPercent,
      completedAt: result.completedAt,
    });
  } catch (error) {
    console.error('Error fetching result:', error);
    return NextResponse.json(
      { error: 'Failed to fetch result' },
      { status: 500 }
    );
  }
}
