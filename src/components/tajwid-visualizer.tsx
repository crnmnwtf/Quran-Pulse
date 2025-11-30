'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, BookOpen } from 'lucide-react';

interface TajwidVisualizationItem {
  letter: string;
  color: string;
  rule: string;
  tooltip: string;
}

interface TajwidData {
  text: string;
  visualization: TajwidVisualizationItem[];
}

interface TajwidVisualizerProps {
  data: TajwidData;
}

export function TajwidVisualizer({ data }: TajwidVisualizerProps) {
  const colorMap = {
    'idgham': '#2ECC71',
    'ikhfa': '#3498DB',
    'qalqalah': '#E74C3C',
    'mad': '#F39C12',
    'ghunnah': '#9B59B6'
  };

  const ruleDescriptions = {
    'idgham': 'Idgham - Meleburkan huruf ke dalam huruf berikutnya',
    'ikhfa': 'Ikhfa - Menyamarkan bunyi huruf',
    'qalqalah': 'Qalqalah - Bunyi bergetar apabila berbaris mati',
    'mad': 'Mad - Memanjangkan bunyi huruf',
    'ghunnah': 'Ghunnah - Mendengung bunyi hidung'
  };

  const getRuleName = (rule: string) => {
    const ruleNames: { [key: string]: string } = {
      'idgham': 'Idgham',
      'ikhfa': 'Ikhfa',
      'qalqalah': 'Qalqalah',
      'mad': 'Mad',
      'ghunnah': 'Ghunnah'
    };
    return ruleNames[rule] || rule;
  };

  return (
    <div className="space-y-6">
      {/* Main Text Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Teks Arab dengan Warna Tajwid
          </CardTitle>
          <CardDescription>
            Setiap warna mewakili peraturan tajwid yang berbeza
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-arabic leading-loose mb-6 p-6 bg-gray-50 rounded-lg">
              {data.visualization.map((item, index) => (
                <span
                  key={index}
                  style={{ 
                    color: item.color,
                    fontSize: '2.5rem',
                    fontFamily: 'Amiri, Noto Sans Arabic, serif',
                    margin: '0 2px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease'
                  }}
                  title={item.tooltip}
                  className="hover:scale-110 inline-block"
                >
                  {item.letter}
                </span>
              ))}
            </div>
            
            {/* Plain Text Reference */}
            <div className="text-lg text-gray-600 font-arabic p-4 bg-white rounded border">
              {data.text}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Penerangan Peraturan Tajwid
          </CardTitle>
          <CardDescription>
            Klik pada huruf berwarna untuk melihat maklumat terperinci
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(colorMap).map(([rule, color]) => (
              <div key={rule} className="flex items-center gap-3 p-3 border rounded-lg hover:shadow-md transition-shadow">
                <div 
                  className="w-8 h-8 rounded-full border-2 border-gray-300"
                  style={{ backgroundColor: color }}
                />
                <div className="flex-1">
                  <div className="font-semibold">{getRuleName(rule)}</div>
                  <div className="text-sm text-gray-600">
                    {ruleDescriptions[rule as keyof typeof ruleDescriptions]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Analisis Terperinci</CardTitle>
          <CardDescription>
            Pecahan setiap huruf mengikut peraturan tajwid
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.visualization.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl font-arabic"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <span style={{ color: item.color }}>{item.letter}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      style={{ 
                        borderColor: item.color, 
                        color: item.color 
                      }}
                    >
                      {getRuleName(item.rule)}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      Posisi {index + 1}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{item.tooltip}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Practice Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Tips Latihan</CardTitle>
          <CardDescription>
            Panduan untuk menguasai peraturan tajwid
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">📖 Bacaan Perlahan</h4>
              <p className="text-sm text-blue-700">
                Mulakan dengan bacaan perlahan untuk fokus pada setiap huruf dan peraturan tajwid.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">🎵 Dengar Contoh</h4>
              <p className="text-sm text-green-700">
                Dengar bacaan dari qari yang mahir untuk meniru intonasi dan tajwid yang betul.
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">🔄 Ulangi Berkali-kali</h4>
              <p className="text-sm text-yellow-700">
                Latih ayat yang sama berulang kali sehingga tajwid menjadi automatik.
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">📝 Rakam dan Analisis</h4>
              <p className="text-sm text-purple-700">
                Gunakan fungsi rakaman untuk menganalisis pembacaan dan kenal pasti tempat yang perlu diperbaiki.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}