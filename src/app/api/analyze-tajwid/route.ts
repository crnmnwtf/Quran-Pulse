import { NextRequest, NextResponse } from 'next/server';
import { glmService } from '@/lib/glm-service';

export async function POST(request: NextRequest) {
  try {
    const { arabicText, userRecitation } = await request.json();

    if (!arabicText || !userRecitation) {
      return NextResponse.json(
        { error: 'Arabic text and user recitation are required' },
        { status: 400 }
      );
    }

    // Analyze Tajwid using GLM
    const tajwidAnalysis = await glmService.analyzeTajwid(arabicText, userRecitation);

    return NextResponse.json({
      success: true,
      tajwidAnalysis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Tajwid Analysis Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to analyze Tajwid',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}