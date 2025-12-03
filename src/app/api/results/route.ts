import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Colour } from '@/lib/questions';

type AnswerInput = {
  questionId: number;
  colour: Colour;
  answerValue: number;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, answers } = body as { userId: number; answers: AnswerInput[] };

    if (!userId || !answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'User ID and answers are required' },
        { status: 400 }
      );
    }

    if (answers.length !== 40) {
      return NextResponse.json(
        { error: 'All 40 questions must be answered' },
        { status: 400 }
      );
    }

    // Calculate scores by colour
    const scores: Record<Colour, number> = {
      red: 0,
      yellow: 0,
      blue: 0,
      green: 0,
    };

    for (const answer of answers) {
      if (answer.colour in scores) {
        scores[answer.colour] += answer.answerValue;
      }
    }

    // Calculate total and percentages
    const total = scores.red + scores.yellow + scores.blue + scores.green;
    const percentages: Record<Colour, number> = {
      red: (scores.red / total) * 100,
      yellow: (scores.yellow / total) * 100,
      blue: (scores.blue / total) * 100,
      green: (scores.green / total) * 100,
    };

    // Create result with answers in a transaction
    const result = await prisma.result.create({
      data: {
        userId,
        redScore: scores.red,
        yellowScore: scores.yellow,
        blueScore: scores.blue,
        greenScore: scores.green,
        redPercent: percentages.red,
        yellowPercent: percentages.yellow,
        bluePercent: percentages.blue,
        greenPercent: percentages.green,
        answers: {
          create: answers.map((answer) => ({
            questionId: answer.questionId,
            colour: answer.colour,
            answerValue: answer.answerValue,
          })),
        },
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
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
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating result:', error);
    return NextResponse.json(
      { error: 'Failed to save results' },
      { status: 500 }
    );
  }
}
