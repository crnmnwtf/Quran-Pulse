import { NextRequest, NextResponse } from 'next/server';
import { glmService } from '@/lib/glm-service';

export async function POST(request: NextRequest) {
  try {
    const { userProgress, currentLevel } = await request.json();

    if (!userProgress || currentLevel === undefined) {
      return NextResponse.json(
        { error: 'User progress and current level are required' },
        { status: 400 }
      );
    }

    // Generate recommendations using GLM
    const recommendations = await glmService.generateRecommendations(userProgress, currentLevel);

    return NextResponse.json({
      success: true,
      recommendations,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Recommendations Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate recommendations',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}