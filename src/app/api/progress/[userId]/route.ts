import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d';

    // Mock progress data - in real app, fetch from database
    const mockProgressData = {
      user_id: userId,
      period: period,
      overall_score: 85.5,
      total_recordings: 156,
      total_practice_minutes: 245,
      current_streak: 7,
      longest_streak: 15,
      chart_data: [
        { date: '2024-01-01', score: 78, practice_time: 30 },
        { date: '2024-01-02', score: 82, practice_time: 25 },
        { date: '2024-01-03', score: 80, practice_time: 40 },
        { date: '2024-01-04', score: 85, practice_time: 35 },
        { date: '2024-01-05', score: 88, practice_time: 30 },
        { date: '2024-01-06', score: 86, practice_time: 45 },
        { date: '2024-01-07', score: 90, practice_time: 40 },
      ],
      statistics: {
        weak_phonemes: [
          { phoneme: 'ث', error_rate: 0.15, count: 12 },
          { phoneme: 'ذ', error_rate: 0.12, count: 8 },
          { phoneme: 'ظ', error_rate: 0.10, count: 6 },
        ],
        strong_phonemes: [
          { phoneme: 'ا', error_rate: 0.02, count: 45 },
          { phoneme: 'ب', error_rate: 0.03, count: 38 },
          { phoneme: 'ت', error_rate: 0.04, count: 32 },
        ],
        weekly_progress: [
          { week: 'Minggu 1', score: 75, recordings: 20 },
          { week: 'Minggu 2', score: 80, recordings: 25 },
          { week: 'Minggu 3', score: 83, recordings: 30 },
          { week: 'Minggu 4', score: 87, recordings: 28 },
        ]
      },
      achievements: {
        lessons_completed: 12,
        perfect_scores: 8,
        total_time_hours: Math.floor(245 / 60),
        average_session_length: 15
      }
    };

    return NextResponse.json({
      success: true,
      data: mockProgressData
    });

  } catch (error) {
    console.error('Progress fetch error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch progress data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}