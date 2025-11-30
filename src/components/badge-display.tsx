'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Lock, Star } from 'lucide-react';

interface Badge {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  requirement: string;
  earned?: boolean;
  earnedAt?: string;
}

interface BadgeDisplayProps {
  badges: Badge[];
  userBadges: Badge[];
}

export function BadgeDisplay({ badges, userBadges }: BadgeDisplayProps) {
  const unlockedBadgeIds = new Set(userBadges.map(ub => ub.id));
  
  const earnedBadges = badges.filter(badge => unlockedBadgeIds.has(badge.id));
  const lockedBadges = badges.filter(badge => !unlockedBadgeIds.has(badge.id));

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ms-MY', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getRequirementText = (requirement: string) => {
    try {
      const req = JSON.parse(requirement);
      if (req.type === 'lessons') {
        return `Selesaikan ${req.count} pelajaran`;
      } else if (req.type === 'score') {
        return `Skor ${req.value}% selama ${req.days} hari`;
      } else if (req.type === 'streak') {
        return `Latihan ${req.days} hari berturut-turut`;
      } else if (req.type === 'tajwid') {
        return `Kuasai semua peraturan tajwid`;
      }
      return 'Syarat khas';
    } catch {
      return 'Syarat khas';
    }
  };

  return (
    <div className="space-y-8">
      {/* Earned Badges */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h2 className="text-2xl font-bold">Lencana Diperoleh</h2>
          <Badge variant="secondary" className="ml-2">
            {earnedBadges.length} / {badges.length}
          </Badge>
        </div>
        
        {earnedBadges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {earnedBadges.map((badge) => (
              <Card key={badge.id} className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50 hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
                    <span className="text-3xl">{badge.iconUrl}</span>
                  </div>
                  <CardTitle className="text-lg">{badge.title}</CardTitle>
                  <CardDescription>{badge.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-yellow-700">Diperoleh</span>
                    </div>
                    {badge.earnedAt && (
                      <p className="text-xs text-gray-600">
                        {formatDate(badge.earnedAt)}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <Lock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 font-medium">Belum ada lencana diperoleh</p>
                <p className="text-sm text-gray-500 mt-1">Mulakan latihan untuk mendapatkan lencana pertama anda!</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Locked Badges */}
      <div>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Lock className="w-5 h-5 text-gray-400" />
          Lencana Tersedia
        </h3>
        
        {lockedBadges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedBadges.map((badge) => (
              <Card key={badge.id} className="opacity-75 hover:opacity-100 transition-opacity">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3 relative">
                    <span className="text-3xl grayscale">{badge.iconUrl}</span>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                      <Lock className="w-3 h-3 text-gray-600" />
                    </div>
                  </div>
                  <CardTitle className="text-lg text-gray-700">{badge.title}</CardTitle>
                  <CardDescription className="text-gray-600">{badge.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 font-medium">
                      Syarat:
                    </p>
                    <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                      {getRequirementText(badge.requirement)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-600">Semua lencana telah diperoleh! 🎉</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Kemajuan Keseluruhan</CardTitle>
          <CardDescription>
            Peratusan lencana yang telah diperoleh
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Kemajuan</span>
              <span className="text-sm text-gray-600">
                {earnedBadges.length} / {badges.length} lencana
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-amber-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(earnedBadges.length / badges.length) * 100}%` }}
              />
            </div>
            <p className="text-center text-lg font-bold text-yellow-600">
              {Math.round((earnedBadges.length / badges.length) * 100)}%
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}