'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mic, Square, Play, FileText, Award, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { AudioRecorder } from './audio-recorder';

interface Lesson {
  id: string;
  title: string;
  description: string;
  iqraLevel: number;
  arabicText: string;
  translation: string;
  completed?: boolean;
  score?: number | null;
}

interface AssessmentModeProps {
  assessmentId: string;
  verses: Lesson[];
}

export function AssessmentMode({ assessmentId, verses }: AssessmentModeProps) {
  const [currentVerse, setCurrentVerse] = useState(0);
  const [recordings, setRecordings] = useState<any[]>([]);
  const [assessmentStatus, setAssessmentStatus] = useState<'intro' | 'in_progress' | 'submitting' | 'completed' | 'failed'>('intro');
  const [finalResult, setFinalResult] = useState<any>(null);
  const [startTime] = useState(new Date());

  const handleRecordingComplete = (result: any) => {
    setRecordings(prev => [...prev, {
      verse_index: currentVerse,
      result: result,
      timestamp: new Date()
    }]);

    if (currentVerse < verses.length - 1) {
      setCurrentVerse(prev => prev + 1);
    } else {
      submitAssessment();
    }
  };

  const startAssessment = () => {
    setAssessmentStatus('in_progress');
  };

  const submitAssessment = async () => {
    setAssessmentStatus('submitting');
    
    // Simulate API call
    setTimeout(() => {
      const mockResult = {
        id: 'result_' + Date.now(),
        score: 87.5,
        grade: 'A',
        status: 'passed',
        total_time: Math.floor((new Date().getTime() - startTime.getTime()) / 1000 / 60), // minutes
        individual_scores: recordings.map((rec, index) => ({
          verse: index + 1,
          score: Math.floor(Math.random() * 20) + 80, // 80-100
          feedback: `Pembacaan ayat ${index + 1} baik. Perlu perbaiki pada beberapa huruf.`
        })),
        strengths: [
          'Kelancaran pembacaan sangat baik',
          'Tajwid dikuasai dengan baik',
          'Tempo pembacaan sesuai'
        ],
        improvements: [
          'Perlu lebih fokus pada huruf ث dan ذ',
          'Latih bacaan dengan tempo lebih perlahan',
          'Perbaiki makhraj huruf yang masih kurang jelas'
        ],
        certificate_url: '/certificates/' + assessmentId + '.pdf',
        completed_at: new Date().toISOString()
      };
      
      setFinalResult(mockResult);
      setAssessmentStatus('completed');
    }, 3000);
  };

  const resetAssessment = () => {
    setCurrentVerse(0);
    setRecordings([]);
    setAssessmentStatus('intro');
    setFinalResult(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-600 bg-green-50';
      case 'B': return 'text-blue-600 bg-blue-50';
      case 'C': return 'text-yellow-600 bg-yellow-50';
      case 'D': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (assessmentStatus === 'intro') {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <FileText className="w-6 h-6" />
            Ujian Penilaian Iqra'
          </CardTitle>
          <CardDescription>
            Ujian untuk menilai kemahiran pembacaan Al-Quran anda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <FileText className="w-8 h-8 mx-auto text-blue-600 mb-2" />
              <h3 className="font-semibold">{verses.length} Ayat</h3>
              <p className="text-sm text-gray-600">Akan dibaca dan dirakam</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Clock className="w-8 h-8 mx-auto text-green-600 mb-2" />
              <h3 className="font-semibold">~15 Minit</h3>
              <p className="text-sm text-gray-600">Anggaran masa</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Award className="w-8 h-8 mx-auto text-purple-600 mb-2" />
              <h3 className="font-semibold">Sijil Digital</h3>
              <p className="text-sm text-gray-600">Jika lulus</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Panduan Ujian
            </h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Pastikan berada di tempat yang sunyi dan selesa</li>
              <li>• Gunakan mikrofon yang berkualiti untuk rakaman yang jelas</li>
              <li>• Baca setiap ayat dengan lancar dan mengikut peraturan tajwid</li>
              <li>• Ujian tidak mempunyai had masa, baca dengan tempo yang selesa</li>
              <li>• Pastikan internet stabil semasa menghantar jawapan</li>
            </ul>
          </div>

          <div className="text-center">
            <Button onClick={startAssessment} size="lg" className="bg-green-600 hover:bg-green-700">
              <Play className="w-4 h-4 mr-2" />
              Mulakan Ujian
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (assessmentStatus === 'in_progress') {
    const currentLesson = verses[currentVerse];
    const progress = ((currentVerse + 1) / verses.length) * 100;

    return (
      <div className="space-y-6">
        {/* Progress Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress Ujian</span>
                <span className="text-sm text-gray-600">
                  {currentVerse + 1} / {verses.length}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Current Verse */}
        <Card>
          <CardHeader>
            <CardTitle>Ayat {currentVerse + 1}</CardTitle>
            <CardDescription>{currentLesson.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-3xl font-arabic mb-4 p-6 bg-gray-50 rounded-lg">
                  {currentLesson.arabicText}
                </p>
                <p className="text-lg text-gray-600">{currentLesson.translation}</p>
              </div>

              <AudioRecorder 
                lessonId={currentLesson.id}
                expectedText={currentLesson.arabicText}
                onAnalysisComplete={handleRecordingComplete}
              />
            </div>
          </CardContent>
        </Card>

        {/* Previous Recordings */}
        {recordings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Rakaman Sebelumnya</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recordings.map((recording, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="font-medium">Ayat {recording.verse_index + 1}</span>
                    </div>
                    <Badge variant="outline" className="text-green-600">
                      {recording.result.score}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  if (assessmentStatus === 'submitting') {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-16">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <h3 className="text-lg font-semibold">Memproses Keputusan...</h3>
            <p className="text-sm text-gray-600">Sila tunggu, kami sedang menganalisis pembacaan anda</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (assessmentStatus === 'completed' && finalResult) {
    return (
      <div className="space-y-6">
        {/* Result Summary */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-green-600">🎉 Tahniah! Anda Lulus</CardTitle>
            <CardDescription>Ujian penilaian Iqra' telah selesai</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{finalResult.score}%</div>
                <p className="text-sm text-gray-600">Skor Keseluruhan</p>
              </div>
              <div className="text-center">
                <Badge className={`text-lg px-4 py-2 ${getGradeColor(finalResult.grade)}`}>
                  Gred {finalResult.grade}
                </Badge>
                <p className="text-sm text-gray-600 mt-1">Kelayakan</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{finalResult.total_time}</div>
                <p className="text-sm text-gray-600">Minit Diambil</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Results */}
        <Tabs defaultValue="scores" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="scores">Skor Terperinci</TabsTrigger>
            <TabsTrigger value="feedback">Maklum Balas</TabsTrigger>
            <TabsTrigger value="certificate">Sijil</TabsTrigger>
          </TabsList>

          <TabsContent value="scores" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Skor Setiap Ayat</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {finalResult.individual_scores.map((score: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">Ayat {score.verse}</span>
                        <span className="text-sm text-gray-600">{verses[index].arabicText.substring(0, 20)}...</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={score.score} className="w-20" />
                        <span className="font-medium w-12 text-right">{score.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">Kekuatan Anda</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {finalResult.strengths.map((strength: string, index: number) => (
                      <div key={index} className="flex items-start gap-2 p-2 bg-green-50 rounded">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-green-700">{strength}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-600">Perlu Diperbaiki</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {finalResult.improvements.map((improvement: string, index: number) => (
                      <div key={index} className="flex items-start gap-2 p-2 bg-blue-50 rounded">
                        <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-blue-700">{improvement}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="certificate">
            <Card>
              <CardHeader>
                <CardTitle>Sijil Digital</CardTitle>
                <CardDescription>
                  Muat turun sijil pencapaian anda
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="w-32 h-32 mx-auto bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Award className="w-16 h-16 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Sijil Tamat Iqra'</h3>
                  <p className="text-gray-600 mb-4">
                    Anda telah berjaya menamatkan ujian penilaian Iqra' dengan gred {finalResult.grade}
                  </p>
                  <Button asChild>
                    <a href={finalResult.certificate_url} download>
                      <FileText className="w-4 h-4 mr-2" />
                      Muat Turun Sijil (PDF)
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button onClick={resetAssessment} variant="outline">
            <Play className="w-4 h-4 mr-2" />
            Ulangi Ujian
          </Button>
          <Button asChild>
            <a href="/dashboard">
              <FileText className="w-4 h-4 mr-2" />
              Kembali ke Dashboard
            </a>
          </Button>
        </div>
      </div>
    );
  }

  return null;
}