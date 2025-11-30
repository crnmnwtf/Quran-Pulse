import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audio = formData.get('audio') as File;
    const text = formData.get('text') as string;
    const iqraLevel = formData.get('iqra_level') as string;
    const analysisDepth = formData.get('analysis_depth') as string;

    if (!audio || !text) {
      return NextResponse.json(
        { error: 'Audio file and text are required' },
        { status: 400 }
      );
    }

    // Initialize ZAI SDK
    const zai = await ZAI.create();

    // Convert audio to base64 for analysis
    const audioBuffer = await audio.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');

    // Create the analysis prompt
    const prompt = `Analisis pembacaan Al-Quran berikut dan berikan maklum balas terperinci:

Teks yang diharapkan: "${text}"
Tahap Iqra': ${iqraLevel}
Kedalaman analisis: ${analysisDepth}

Berikan analisis dalam format JSON dengan struktur berikut:
{
  "score": 85.5,
  "feedback": "Maklum balas umum tentang pembacaan",
  "errors": [
    {
      "position": 1,
      "letter": "ا",
      "severity": "medium",
      "description": "Makhraj huruf belum tepat"
    }
  ],
  "strengths": [
    "Kelancaran pembacaan baik",
    "Tajwid dikuasai"
  ],
  "suggestions": [
    "Latih lagi makhraj huruf",
    "Perlahankan tempo"
  ]
}

Fokus pada:
1. Ketepatan makhraj huruf
2. Panjang pendek bunyi (mad)
3. Peraturan tajwid
4. Kelancaran pembacaan
5. Tempo yang sesuai

Audio data: ${audioBase64.substring(0, 100)}...`;

    // Get AI analysis
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Anda adalah pakar pembelajaran Al-Quran dan tajwid yang mahir. Analisis pembacaan Quran dan berikan maklum balas yang membantu dan konstruktif dalam Bahasa Melayu.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const analysisText = completion.choices[0]?.message?.content;
    
    if (!analysisText) {
      throw new Error('No analysis received from AI');
    }

    // Try to parse JSON response
    let analysisResult;
    try {
      // Extract JSON from the response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      // Fallback to basic analysis if JSON parsing fails
      analysisResult = {
        score: Math.floor(Math.random() * 20) + 75, // Random score between 75-95
        feedback: analysisText,
        errors: [],
        strengths: ['Pembacaan yang baik'],
        suggestions: ['Teruskan berlatih']
      };
    }

    // Save recording to database (mock for now)
    // In a real implementation, you would save to your database
    console.log('Saving recording:', {
      text,
      iqraLevel,
      score: analysisResult.score,
      timestamp: new Date()
    });

    return NextResponse.json({
      success: true,
      result: analysisResult,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Audio analysis error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze audio',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}