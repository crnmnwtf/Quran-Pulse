import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Get all lessons with user progress
    const lessons = await db.lesson.findMany({
      orderBy: [
        { iqraLevel: 'asc' },
        { order: 'asc' }
      ]
    });

    // Get sample user recordings for demonstration
    const sampleRecordings = await db.recording.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        lesson: true,
        user: {
          select: {
            name: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      lessons: lessons.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        iqraLevel: lesson.iqraLevel,
        arabicText: lesson.arabicText,
        translation: lesson.translation,
        tajwidRules: lesson.tajwidRules,
        audioUrl: lesson.audioUrl,
        order: lesson.order
      })),
      sampleRecordings: sampleRecordings.map(recording => ({
        id: recording.id,
        score: recording.score,
        feedback: recording.feedback,
        duration: recording.duration,
        createdAt: recording.createdAt,
        lesson: {
          title: recording.lesson.title,
          iqraLevel: recording.lesson.iqraLevel,
          arabicText: recording.lesson.arabicText
        },
        user: {
          name: recording.user.name
        }
      }))
    });

  } catch (error) {
    console.error('Lessons API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch lessons',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, iqraLevel, arabicText, translation, tajwidRules, audioUrl, order } = await request.json();

    if (!title || !iqraLevel || !arabicText) {
      return NextResponse.json(
        { error: 'Title, Iqra level, and Arabic text are required' },
        { status: 400 }
      );
    }

    const lesson = await db.lesson.create({
      data: {
        title,
        description,
        iqraLevel,
        arabicText,
        translation,
        tajwidRules,
        audioUrl,
        order
      }
    });

    return NextResponse.json({
      success: true,
      lesson
    });

  } catch (error) {
    console.error('Lesson Creation Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create lesson',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}