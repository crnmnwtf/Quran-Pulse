'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Mic, Square, Play, Volume2, Wifi, WifiOff } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

interface RealTimeFeedbackProps {
  arabicText: string;
  iqraLevel: number;
  userId: string;
  onSessionComplete: (result: any) => void;
}

export function RealTimeFeedback({ arabicText, iqraLevel, userId, onSessionComplete }: RealTimeFeedbackProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [currentLetter, setCurrentLetter] = useState('');
  const [status, setStatus] = useState<'idle' | 'connecting' | 'recording' | 'processing'>('idle');
  
  const socketRef = useRef<Socket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const sequenceRef = useRef(0);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const connectWebSocket = () => {
    setStatus('connecting');
    
    // Connect to pronunciation service
    socketRef.current = io('/?XTransformPort=3003');
    
    socketRef.current.on('connect', () => {
      console.log('Connected to pronunciation service');
      setIsConnected(true);
      setStatus('idle');
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from pronunciation service');
      setIsConnected(false);
      setStatus('idle');
    });

    socketRef.current.on('session_started', (data) => {
      console.log('Session started:', data);
      setSessionId(data.session_id);
    });

    socketRef.current.on('feedback', (data) => {
      console.log('Received feedback:', data);
      
      setFeedback(prev => [...prev, data]);
      setCurrentPosition(data.current_position || currentPosition + 1);
      setCurrentLetter(data.current_letter || '');
      
      // Play audio feedback based on status
      if (data.status === 'error') {
        playErrorSound();
      } else if (data.status === 'warning') {
        playWarningSound();
      }
    });

    socketRef.current.on('final_analysis', (data) => {
      console.log('Final analysis:', data);
      onSessionComplete(data);
      setIsRecording(false);
      setStatus('idle');
    });

    socketRef.current.on('error', (error) => {
      console.error('WebSocket error:', error);
      setStatus('idle');
    });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      chunksRef.current = [];
      sequenceRef.current = 0;

      mediaRecorderRef.current.ondataavailable = async (e) => {
        if (e.data.size > 0 && socketRef.current && sessionId) {
          chunksRef.current.push(e.data);
          
          // Convert to base64 and send to server
          const reader = new FileReader();
          reader.onload = () => {
            const base64Audio = reader.result as string;
            const audioData = base64Audio.split(',')[1];
            
            socketRef.current!.emit('audio_chunk', {
              session_id: sessionId,
              audio_data: audioData,
              sequence: sequenceRef.current++
            });
          };
          reader.readAsDataURL(e.data);
        }
      };

      mediaRecorderRef.current.start(200); // Send chunks every 200ms
      setIsRecording(true);
      setStatus('recording');

      // Start session
      if (socketRef.current) {
        socketRef.current.emit('start_session', {
          text: arabicText,
          iqra_level: iqraLevel,
          user_id: userId
        });
      }

    } catch (err) {
      console.error('Error starting recording:', err);
      setStatus('idle');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setStatus('processing');

      // End session
      if (socketRef.current && sessionId) {
        socketRef.current.emit('end_session', {
          session_id: sessionId
        });
      }
    }
  };

  const playErrorSound = () => {
    // Create a simple error beep sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 300;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.1;
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const playWarningSound = () => {
    // Create a simple warning beep sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 500;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.05;
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.05);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return '📝';
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isConnected ? (
                <>
                  <Wifi className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">Bersambung</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-600">Tidak Bersambung</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Status:</span>
              <Badge variant={status === 'recording' ? 'destructive' : 'secondary'}>
                {status === 'idle' && 'Diam'}
                {status === 'connecting' && 'Menyambung...'}
                {status === 'recording' && 'Merakam'}
                {status === 'processing' && 'Memproses...'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Arabic Text Display */}
      <Card>
        <CardHeader>
          <CardTitle>Teks Pembacaan</CardTitle>
          <CardDescription>Baca ayat di bawah dengan kuat dan jelas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-arabic leading-loose p-6 bg-gray-50 rounded-lg">
              {arabicText.split('').map((letter, index) => (
                <span
                  key={index}
                  className={`inline-block transition-all duration-300 ${
                    index === currentPosition ? 'text-blue-600 text-4xl scale-125' : ''
                  }`}
                >
                  {letter}
                </span>
              ))}
            </div>
            {currentLetter && (
              <p className="text-sm text-gray-600 mt-2">
                Huruf semasa: <span className="font-bold text-blue-600">{currentLetter}</span>
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recording Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5" />
            Kawalan Rakaman
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            {!isRecording ? (
              <Button 
                onClick={startRecording}
                disabled={!isConnected || status !== 'idle'}
                size="lg"
                className="bg-green-600 hover:bg-green-700"
              >
                <Mic className="w-4 h-4 mr-2" />
                Mula Rakaman Real-time
              </Button>
            ) : (
              <Button 
                onClick={stopRecording}
                size="lg"
                variant="destructive"
              >
                <Square className="w-4 h-4 mr-2" />
                Hentikan Rakaman
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Feedback */}
      {feedback.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              Maklum Balas Real-time
            </CardTitle>
            <CardDescription>
              Maklum balas automatik semasa pembacaan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {feedback.slice(-10).map((item, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border-l-4 ${getStatusColor(item.status)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getStatusIcon(item.status)}</span>
                      <span className="font-medium">{item.message}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      Posisi {item.current_position}
                    </span>
                  </div>
                  {item.suggestion && (
                    <p className="text-sm mt-1 opacity-75">{item.suggestion}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Indicator */}
      {arabicText && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress Pembacaan</span>
                <span className="text-sm text-gray-600">
                  {currentPosition} / {arabicText.length}
                </span>
              </div>
              <Progress 
                value={(currentPosition / arabicText.length) * 100} 
                className="h-2" 
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}