import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user's progress data
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        progress: {
          orderBy: { date: 'desc' },
          take: 30 // Last 30 days
        },
        recordings: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            lesson: true
          }
        },
        userBadges: {
          include: {
            badge: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate statistics
    const totalRecordings = await db.recording.count({
      where: { userId }
    });

    const averageScore = await db.recording.aggregate({
      where: { 
        userId,
        score: { not: null }
      },
      _avg: { score: true }
    });

    const recentProgress = user.progress.slice(0, 7); // Last 7 days

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        currentIqraLevel: user.currentIqraLevel,
        totalPracticeTime: user.totalPracticeTime,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak
      },
      statistics: {
        totalRecordings,
        averageScore: averageScore._avg.score || 0,
        recentProgress: recentProgress.map(p => ({
          date: p.date,
          averageScore: p.averageScore,
          practiceTime: p.practiceTime,
          recordingsCount: p.recordingsCount
        }))
      },
      recentRecordings: user.recordings.map(r => ({
        id: r.id,
        score: r.score,
        duration: r.duration,
        createdAt: r.createdAt,
        lesson: {
          title: r.lesson.title,
          iqraLevel: r.lesson.iqraLevel
        }
      })),
      badges: user.userBadges.map(ub => ({
        id: ub.badge.id,
        title: ub.badge.title,
        description: ub.badge.description,
        iconUrl: ub.badge.iconUrl,
        earnedAt: ub.earnedAt
      }))
    });

  } catch (error) {
    console.error('Progress API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch progress data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, date, iqraLevel, averageScore, practiceTime, recordingsCount } = await request.json();

    if (!userId || !date) {
      return NextResponse.json(
        { error: 'User ID and date are required' },
        { status: 400 }
      );
    }

    // Create or update progress record
    const progress = await db.progress.upsert({
      where: {
        userId_date: {
          userId,
          date: new Date(date)
        }
      },
      update: {
        iqraLevel,
        averageScore,
        practiceTime,
        recordingsCount
      },
      create: {
        userId,
        date: new Date(date),
        iqraLevel,
        averageScore,
        practiceTime,
        recordingsCount
      }
    });

    return NextResponse.json({
      success: true,
      progress
    });

  } catch (error) {
    console.error('Progress Update Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update progress',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}