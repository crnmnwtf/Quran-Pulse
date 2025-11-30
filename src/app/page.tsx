'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Mic, Trophy, TrendingUp, Award, Clock, Target, Play, Wifi } from 'lucide-react';
import { AudioRecorder } from '@/components/audio-recorder';
import { ProgressDashboard } from '@/components/progress-dashboard';
import { BadgeDisplay } from '@/components/badge-display';
import { TajwidVisualizer } from '@/components/tajwid-visualizer';
import { AssessmentMode } from '@/components/assessment-mode';
import { RealTimeFeedback } from '@/components/real-time-feedback';
import { ThemeToggle } from '@/components/theme-toggle';

// Mock data for demonstration
const mockUser = {
  name: 'Ahmad bin Ismail',
  currentIqraLevel: 3,
  totalPracticeTime: 245,
  currentStreak: 7,
  longestStreak: 15,
  overallScore: 85.5,
  totalRecordings: 156
};

const mockLessons = [
  {
    id: '1',
    title: 'Pelajaran 1: Huruf Hijaiyyah',
    description: 'Mengenal huruf-huruf hijaiyyah asas',
    iqraLevel: 1,
    arabicText: 'ا ب ت ث ج ح خ',
    translation: 'Alif Ba Ta Sa Jim Ha Kha',
    completed: true,
    score: 92
  },
  {
    id: '2',
    title: 'Pelajaran 2: Baris Fathah',
    description: 'Membaca huruf dengan baris fathah',
    iqraLevel: 1,
    arabicText: 'َا َب َت َث',
    translation: 'A Ba Ta Sa',
    completed: true,
    score: 88
  },
  {
    id: '3',
    title: 'Pelajaran 3: Baris Kasrah',
    description: 'Membaca huruf dengan baris kasrah',
    iqraLevel: 2,
    arabicText: 'ِا ِب ِت ِث',
    translation: 'I Bi Ti Si',
    completed: true,
    score: 85
  },
  {
    id: '4',
    title: 'Pelajaran 4: Baris Dhammah',
    description: 'Membaca huruf dengan baris dhammah',
    iqraLevel: 2,
    arabicText: 'ُا ُب ُت ُث',
    translation: 'U Bu Tu Su',
    completed: false,
    score: null
  }
];

const mockBadges = [
  {
    id: '1',
    title: 'Pemula Iqra',
    description: 'Menyelesaikan 10 pelajaran pertama',
    iconUrl: '🎯',
    requirement: '{"type": "lessons", "count": 10}',
    earned: true,
    earnedAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Hafiz Muda',
    description: 'Mencapai skor purata 90% selama 7 hari',
    iconUrl: '🏆',
    requirement: '{"type": "score", "value": 90, "days": 7}',
    earned: true,
    earnedAt: '2024-02-20'
  },
  {
    id: '3',
    title: 'Gigih Berlatih',
    description: 'Berpelatih selama 30 hari berturut-turut',
    iconUrl: '🔥',
    requirement: '{"type": "streak", "days": 30}',
    earned: false
  },
  {
    id: '4',
    title: 'Master Tajwid',
    description: 'Menyelesaikan semua pelajaran tajwid',
    iconUrl: '👑',
    requirement: '{"type": "tajwid", "all": true}',
    earned: false
  }
];

const mockTajwidData = {
  text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
  visualization: [
    { letter: 'بِ', color: '#2ECC71', rule: 'qalqalah', tooltip: 'Qalqalah: Bunyi bergetar' },
    { letter: 'سْ', color: '#3498DB', rule: 'ikhfa', tooltip: 'Ikhfa: Bunyi samar' },
    { letter: 'مِ', color: '#9B59B6', rule: 'ghunnah', tooltip: 'Ghunnah: Dengung' },
    { letter: 'اللَّ', color: '#F39C12', rule: 'mad', tooltip: 'Mad: Bunyi panjang' },
    { letter: 'هِ', color: '#2ECC71', rule: 'qalqalah', tooltip: 'Qalqalah: Bunyi bergetar' },
    { letter: 'الرَّ', color: '#F39C12', rule: 'mad', tooltip: 'Mad: Bunyi panjang' },
    { letter: 'حْمَ', color: '#E74C3C', rule: 'idgham', tooltip: 'Idgham: Bunyi lebur' },
    { letter: 'ٰنِ', color: '#9B59B6', rule: 'ghunnah', tooltip: 'Ghunnah: Dengung' },
    { letter: 'الرَّ', color: '#F39C12', rule: 'mad', tooltip: 'Mad: Bunyi panjang' },
    { letter: 'حِ', color: '#E74C3C', rule: 'idgham', tooltip: 'Idgham: Bunyi lebur' },
    { letter: 'يمِ', color: '#9B59B6', rule: 'ghunnah', tooltip: 'Ghunnah: Dengung' }
  ]
};

export default function QuranPulseApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [practiceMode, setPracticeMode] = useState<'standard' | 'realtime'>('standard');

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
    setActiveTab('practice');
  };

  const handleRecordingComplete = (result) => {
    console.log('Recording completed:', result);
    // Handle recording result
  };

  const handleRealTimeSessionComplete = (result) => {
    console.log('Real-time session completed:', result);
    // Handle real-time session result
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="bg-card rounded-xl shadow-sm p-6 mb-6 border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Quran Pulse</h1>
                <p className="text-sm text-muted-foreground">Platform Pembelajaran Iqra' Digital</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <ThemeToggle />
              <div className="text-right">
                <p className="font-semibold text-foreground">{mockUser.name}</p>
                <p className="text-sm text-muted-foreground">Tahap Iqra' {mockUser.currentIqraLevel}</p>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold">{mockUser.currentStreak} hari</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-card shadow-sm border">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="lessons" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Pelajaran
            </TabsTrigger>
            <TabsTrigger value="practice" className="flex items-center gap-2">
              <Mic className="w-4 h-4" />
              Latihan
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Pencapaian
            </TabsTrigger>
            <TabsTrigger value="assessment" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Ujian
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Skor Purata</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockUser.overallScore}%</div>
                  <p className="text-xs text-muted-foreground">+2.5% dari minggu lalu</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Jumlah Rakaman</CardTitle>
                  <Mic className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockUser.totalRecordings}</div>
                  <p className="text-xs text-muted-foreground">12 rakaman hari ini</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Masa Latihan</CardTitle>
                  <Clock className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockUser.totalPracticeTime} min</div>
                  <p className="text-xs text-muted-foreground">45 min hari ini</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Gigitan Semasa</CardTitle>
                  <Trophy className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockUser.currentStreak} hari</div>
                  <p className="text-xs text-muted-foreground">Rekod: {mockUser.longestStreak} hari</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProgressDashboard userId="user1" />
              <Card>
                <CardHeader>
                  <CardTitle>Visualisasi Tajwid</CardTitle>
                  <CardDescription>Pelajari peraturan tajwid dengan warna</CardDescription>
                </CardHeader>
                <CardContent>
                  <TajwidVisualizer data={mockTajwidData} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Lessons Tab */}
          <TabsContent value="lessons" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockLessons.map((lesson) => (
                <Card key={lesson.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant={lesson.completed ? "default" : "secondary"}>
                        Tahap {lesson.iqraLevel}
                      </Badge>
                      {lesson.completed && (
                        <Badge variant="outline" className="text-green-600">
                          {lesson.score}%
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{lesson.title}</CardTitle>
                    <CardDescription>{lesson.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <p className="text-2xl font-arabic mb-2">{lesson.arabicText}</p>
                        <p className="text-sm text-gray-600">{lesson.translation}</p>
                      </div>
                      <Button 
                        onClick={() => handleLessonClick(lesson)}
                        className="w-full"
                        variant={lesson.completed ? "outline" : "default"}
                      >
                        {lesson.completed ? (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Ulangi Latihan
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Mulakan Pelajaran
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Practice Tab */}
          <TabsContent value="practice" className="space-y-6">
            {selectedLesson ? (
              <div className="space-y-6">
                {/* Practice Mode Selector */}
                <Card>
                  <CardHeader>
                    <CardTitle>Pilih Mod Latihan</CardTitle>
                    <CardDescription>Pilih mod latihan yang sesuai untuk anda</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button
                        onClick={() => setPracticeMode('standard')}
                        variant={practiceMode === 'standard' ? 'default' : 'outline'}
                        className="p-4 h-auto flex flex-col items-start"
                      >
                        <Mic className="w-6 h-6 mb-2" />
                        <div className="text-left">
                          <h3 className="font-semibold">Latihan Standard</h3>
                          <p className="text-sm text-gray-600">Rakam dan analisis selepas selesai</p>
                        </div>
                      </Button>
                      <Button
                        onClick={() => setPracticeMode('realtime')}
                        variant={practiceMode === 'realtime' ? 'default' : 'outline'}
                        className="p-4 h-auto flex flex-col items-start"
                      >
                        <Wifi className="w-6 h-6 mb-2" />
                        <div className="text-left">
                          <h3 className="font-semibold">Maklum Balas Real-time</h3>
                          <p className="text-sm text-gray-600">Dapatkan maklum balas semasa membaca</p>
                        </div>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Lesson Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedLesson.title}</CardTitle>
                    <CardDescription>{selectedLesson.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <p className="text-4xl font-arabic mb-4">{selectedLesson.arabicText}</p>
                      <p className="text-lg text-gray-600">{selectedLesson.translation}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Practice Component */}
                {practiceMode === 'standard' ? (
                  <AudioRecorder 
                    lessonId={selectedLesson.id}
                    expectedText={selectedLesson.arabicText}
                    onAnalysisComplete={handleRecordingComplete}
                  />
                ) : (
                  <RealTimeFeedback
                    arabicText={selectedLesson.arabicText}
                    iqraLevel={selectedLesson.iqraLevel}
                    userId="user1"
                    onSessionComplete={handleRealTimeSessionComplete}
                  />
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-600">Pilih pelajaran dari tab Pelajaran</p>
                    <p className="text-sm text-gray-500">Pilih satu pelajaran untuk mula berlatih</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <BadgeDisplay badges={mockBadges} userBadges={mockBadges.filter(b => b.earned)} />
          </TabsContent>

          {/* Assessment Tab */}
          <TabsContent value="assessment" className="space-y-6">
            <AssessmentMode assessmentId="assessment1" verses={mockLessons.slice(0, 3)} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}