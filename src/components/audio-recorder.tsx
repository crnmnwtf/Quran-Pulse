'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Mic, Square, Loader2, Play, Volume2 } from 'lucide-react';

interface AudioRecorderProps {
  lessonId: string;
  expectedText: string;
  onAnalysisComplete: (result: any) => void;
}

export function AudioRecorder({ lessonId, expectedText, onAnalysisComplete }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<'idle' | 'analyzing' | 'complete' | 'error'>('idle');
  const [recordingTime, setRecordingTime] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

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

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        chunksRef.current = [];
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        
        // Auto-submit for analysis
        handleAnalyze(blob);
      };

      mediaRecorderRef.current.start(100);
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone access denied:', err);
      setAnalysisStatus('error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleAnalyze = async (blob: Blob) => {
    setAnalysisStatus('analyzing');

    const blobToBase64 = (blob: Blob): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]); // Remove data URL prefix
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    };

    try {
      const response = await fetch('/api/analyze-pronunciation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audioData: await blobToBase64(blob),
          expectedText: expectedText
        }),
      });
      
      if (!response.ok) {
        throw new Error('Analysis failed');
      }
      
      const result = await response.json();
      setAnalysisResult(result);
      setAnalysisStatus('complete');
      onAnalysisComplete(result);
    } catch (err) {
      setAnalysisStatus('error');
      console.error('Analysis failed:', err);
    }
  };

  const playRecording = () => {
    if (audioBlob && audioRef.current) {
      const url = URL.createObjectURL(audioBlob);
      audioRef.current.src = url;
      audioRef.current.play();
      setIsPlaying(true);
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(url);
      };
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { variant: 'default' as const, text: 'Cemerlang' };
    if (score >= 80) return { variant: 'secondary' as const, text: 'Baik' };
    if (score >= 70) return { variant: 'outline' as const, text: 'Memuaskan' };
    return { variant: 'destructive' as const, text: 'Perlu Improvisasi' };
  };

  return (
    <div className="space-y-6">
      {/* Recording Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5" />
            Rakaman Audio
          </CardTitle>
          <CardDescription>
            Klik butang rakam dan bacakan ayat di atas dengan jelas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            {/* Recording Status */}
            {isRecording && (
              <div className="w-full space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-600 font-medium">Sedang Merakam...</span>
                  <span className="text-sm text-gray-500">{formatTime(recordingTime)}</span>
                </div>
                <div className="flex justify-center">
                  <WaveformVisualizer />
                </div>
              </div>
            )}

            {/* Control Buttons */}
            <div className="flex gap-4">
              {!isRecording ? (
                <Button 
                  onClick={startRecording}
                  disabled={analysisStatus === 'analyzing'}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Mic className="w-4 h-4 mr-2" />
                  Mula Rakam
                </Button>
              ) : (
                <Button 
                  onClick={stopRecording}
                  size="lg"
                  variant="destructive"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Hentikan
                </Button>
              )}

              {audioBlob && !isRecording && (
                <Button 
                  onClick={playRecording}
                  variant="outline"
                  disabled={isPlaying}
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isPlaying ? 'Memainkan...' : 'Mainkan'}
                </Button>
              )}
            </div>

            {/* Audio Element */}
            <audio ref={audioRef} className="hidden" />
          </div>
        </CardContent>
      </Card>

      {/* Analysis Status */}
      {analysisStatus === 'analyzing' && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-lg font-medium">Menganalisis rakaman anda...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      {analysisStatus === 'complete' && analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                Hasil Analisis
              </span>
              <Badge variant={getScoreBadge(analysisResult.score).variant}>
                {getScoreBadge(analysisResult.score).text}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Score */}
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(analysisResult.score)}`}>
                {analysisResult.score}%
              </div>
              <Progress value={analysisResult.score} className="mt-2" />
            </div>

            {/* Detailed Feedback */}
            {analysisResult.feedback && (
              <div className="space-y-3">
                <h4 className="font-semibold">Maklum Balas Terperinci:</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">{analysisResult.feedback}</p>
                </div>
              </div>
            )}

            {/* Error Analysis */}
            {analysisResult.errors && analysisResult.errors.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-red-600">Perlu Diperbaiki:</h4>
                <div className="space-y-2">
                  {analysisResult.errors.map((error: any, index: number) => (
                    <div key={index} className="border-l-4 border-red-400 bg-red-50 p-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-red-800">Huruf {error.position}</span>
                        <Badge variant="outline" className="text-red-600">
                          {error.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-red-700 mt-1">{error.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Positive Feedback */}
            {analysisResult.strengths && analysisResult.strengths.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-green-600">Kekuatan Anda:</h4>
                <div className="space-y-2">
                  {analysisResult.strengths.map((strength: string, index: number) => (
                    <div key={index} className="border-l-4 border-green-400 bg-green-50 p-3">
                      <p className="text-sm text-green-700">{strength}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {analysisStatus === 'error' && (
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-red-600">
              <Volume2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Analisis Gagal</h3>
              <p className="text-sm text-gray-600">
                Sila cuba rakam semula atau periksa sambungan internet anda.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Waveform Visualizer Component
function WaveformVisualizer() {
  return (
    <div className="flex items-center gap-1 h-16">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="w-1 bg-green-500 rounded-full animate-pulse"
          style={{
            height: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  );
}