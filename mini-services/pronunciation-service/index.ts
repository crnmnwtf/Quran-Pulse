import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import ZAI from 'z-ai-web-dev-sdk';

const server = createServer();
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = 3003;

// Store active sessions
const activeSessions = new Map();

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Start real-time pronunciation session
  socket.on('start_session', async (data) => {
    try {
      const { text, iqra_level, user_id } = data;
      const sessionId = `session_${Date.now()}_${user_id}`;
      
      // Store session data
      activeSessions.set(sessionId, {
        text,
        iqra_level,
        user_id,
        socket_id: socket.id,
        start_time: new Date(),
        audio_chunks: [],
        current_position: 0
      });

      socket.emit('session_started', {
        session_id: sessionId,
        text,
        message: 'Sesi maklum balas real-time telah bermula'
      });

      console.log(`Session started: ${sessionId}`);
    } catch (error) {
      console.error('Error starting session:', error);
      socket.emit('error', { message: 'Failed to start session' });
    }
  });

  // Handle audio chunks
  socket.on('audio_chunk', async (data) => {
    try {
      const { session_id, audio_data, sequence } = data;
      const session = activeSessions.get(session_id);

      if (!session) {
        socket.emit('error', { message: 'Session not found' });
        return;
      }

      // Store audio chunk
      session.audio_chunks.push({
        data: audio_data,
        sequence,
        timestamp: new Date()
      });

      // Process audio every few chunks for real-time feedback
      if (session.audio_chunks.length % 5 === 0) {
        await provideRealTimeFeedback(socket, session);
      }

    } catch (error) {
      console.error('Error processing audio chunk:', error);
      socket.emit('error', { message: 'Failed to process audio' });
    }
  });

  // End session
  socket.on('end_session', (data) => {
    try {
      const { session_id } = data;
      const session = activeSessions.get(session_id);

      if (session) {
        // Provide final analysis
        provideFinalAnalysis(socket, session);
        activeSessions.delete(session_id);
      }

      socket.emit('session_ended', {
        session_id,
        message: 'Sesi telah tamat'
      });

      console.log(`Session ended: ${session_id}`);
    } catch (error) {
      console.error('Error ending session:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    
    // Clean up sessions for this socket
    for (const [sessionId, session] of activeSessions.entries()) {
      if (session.socket_id === socket.id) {
        activeSessions.delete(sessionId);
        console.log(`Session cleaned up: ${sessionId}`);
      }
    }
  });
});

async function provideRealTimeFeedback(socket, session) {
  try {
    // Initialize ZAI SDK
    const zai = await ZAI.create();

    // Get recent audio chunks for analysis
    const recentChunks = session.audio_chunks.slice(-10);
    const audioData = recentChunks.map(chunk => chunk.data).join('');

    // Create analysis prompt
    const prompt = `Berikan maklum balas real-time untuk pembacaan Al-Quran:

Teks yang diharapkan: "${session.text}"
Tahap Iqra': ${session.iqra_level}
Posisi semasa: ${session.current_position}

Data audio: ${audioData.substring(0, 200)}...

Berikan maklum balas dalam format JSON:
{
  "current_position": 5,
  "status": "good" | "warning" | "error",
  "message": "Maklum balas pendek",
  "current_letter": "ا",
  "suggestion": "Cadangan singkat"
}

Fokus pada:
1. Ketepatan huruf semasa
2. Makhraj yang betul
3. Tajwid asas`;

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Anda adalah pakar tajwid yang memberikan maklum balas real-time. Berikan respons yang singkat dan jelas.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 200,
    });

    const feedbackText = completion.choices[0]?.message?.content;
    
    if (feedbackText) {
      try {
        const jsonMatch = feedbackText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const feedback = JSON.parse(jsonMatch[0]);
          
          socket.emit('feedback', {
            type: 'feedback',
            ...feedback,
            timestamp: new Date().toISOString()
          });

          // Update session position
          session.current_position = feedback.current_position || session.current_position + 1;
        }
      } catch (parseError) {
        // Send basic feedback if JSON parsing fails
        socket.emit('feedback', {
          type: 'feedback',
          status: 'good',
          message: 'Teruskan pembacaan',
          timestamp: new Date().toISOString()
        });
      }
    }

  } catch (error) {
    console.error('Error providing real-time feedback:', error);
  }
}

async function provideFinalAnalysis(socket, session) {
  try {
    // Initialize ZAI SDK
    const zai = await ZAI.create();

    // Combine all audio data
    const allAudioData = session.audio_chunks.map(chunk => chunk.data).join('');
    
    const sessionDuration = new Date().getTime() - session.start_time.getTime();
    const durationMinutes = Math.floor(sessionDuration / 60000);

    const prompt = `Analisis akhir sesi pembacaan Al-Quran:

Teks: "${session.text}"
Tahap Iqra': ${session.iqra_level}
Tempoh: ${durationMinutes} minit
Jumlah rakaman: ${session.audio_chunks.length}

Data audio lengkap: ${allAudioData.substring(0, 500)}...

Berikan analisis akhir dalam format JSON:
{
  "overall_score": 85.5,
  "accuracy": 88.0,
  "fluency": 82.0,
  "tajwid_compliance": 87.5,
  "feedback": "Maklum balas keseluruhan",
  "strengths": ["Kekuatan 1", "Kekuatan 2"],
  "improvements": ["Perbaikan 1", "Perbaikan 2"],
  "next_steps": ["Langkah seterusnya 1", "Langkah seterusnya 2"]
}`;

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Anda adalah pakar penilaian pembacaan Al-Quran. Berikan analisis yang komprehensif dan membina.'
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
    
    if (analysisText) {
      try {
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const analysis = JSON.parse(jsonMatch[0]);
          
          socket.emit('final_analysis', {
            type: 'final_analysis',
            ...analysis,
            session_duration: durationMinutes,
            total_chunks: session.audio_chunks.length,
            timestamp: new Date().toISOString()
          });
        }
      } catch (parseError) {
        console.error('Error parsing final analysis:', parseError);
      }
    }

  } catch (error) {
    console.error('Error providing final analysis:', error);
  }
}

server.listen(PORT, () => {
  console.log(`Pronunciation service running on port ${PORT}`);
  console.log(`WebSocket endpoint: ws://localhost:${PORT}`);
});