import { NextRequest, NextResponse } from 'next/server';
import { glmService } from '@/lib/glm-service';

export async function POST(request: NextRequest) {
  try {
    const { audioData, expectedText } = await request.json();

    if (!audioData || !expectedText) {
      return NextResponse.json(
        { error: 'Audio data and expected text are required' },
        { status: 400 }
      );
    }

    // Analyze pronunciation using GLM
    const analysis = await glmService.analyzePronunciation(audioData, expectedText);

    return NextResponse.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Pronunciation Analysis Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to analyze pronunciation',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}