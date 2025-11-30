'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Calendar, Award } from 'lucide-react';

interface ProgressDashboardProps {
  userId: string;
}

export function ProgressDashboard({ userId }: ProgressDashboardProps) {
  const [progressData, setProgressData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        // Mock data for now - in real app, fetch from API
        const mockData = {
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
          }
        };
        
        setTimeout(() => {
          setProgressData(mockData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch progress:', error);
        setLoading(false);
      }
    };

    loadProgress();
  }, [userId]);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  if (!progressData) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-gray-500">Tiada data progress tersedia</p>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ms-MY', { day: 'numeric', month: 'short' });
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) {
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    } else if (current < previous) {
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Prestasi Mingguan
          </CardTitle>
          <CardDescription>
            Skor purata dan jumlah rakaman mingguan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={progressData.chart_data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                labelFormatter={(value) => formatDate(value)}
                formatter={(value, name) => [
                  value,
                  name === 'score' ? 'Skor (%)' : 'Masa (min)'
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
                name="score"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Progress 4 Minggu
            </CardTitle>
            <CardDescription>
              Perbandingan skor mingguan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={progressData.statistics.weekly_progress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="week"
                  tick={{ fontSize: 11 }}
                />
                <YAxis 
                  domain={[0, 100]}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    value,
                    name === 'score' ? 'Skor' : 'Rakaman'
                  ]}
                />
                <Bar 
                  dataKey="score" 
                  fill="#3b82f6"
                  name="score"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Statistik Pembelajaran
            </CardTitle>
            <CardDescription>
              Analisis prestasi terkini
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium">Skor Purata</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-green-600">
                    {progressData.overall_score}%
                  </span>
                  {getTrendIcon(85.5, 82.3)}
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium">Jumlah Rakaman</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-blue-600">
                    {progressData.total_recordings}
                  </span>
                  {getTrendIcon(156, 140)}
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium">Masa Latihan</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-purple-600">
                    {progressData.total_practice_minutes} min
                  </span>
                  {getTrendIcon(245, 220)}
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm font-medium">Gigitan Semasa</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-yellow-600">
                    {progressData.current_streak} hari
                  </span>
                  {getTrendIcon(7, 5)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {progressData.statistics.weak_phonemes && (
        <Card>
          <CardHeader>
            <CardTitle>Phoneme Yang Perlu Diperbaiki</CardTitle>
            <CardDescription>
              Huruf-huruf yang masih memerlukan latihan tambahan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {progressData.statistics.weak_phonemes.map((phoneme: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-arabic font-bold text-red-600">
                      {phoneme.phoneme}
                    </span>
                    <div>
                      <p className="text-sm font-medium">Kadar Ralat</p>
                      <p className="text-xs text-gray-600">{phoneme.count} kejadian</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-red-600">
                      {Math.round(phoneme.error_rate * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}