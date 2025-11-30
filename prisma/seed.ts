import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const lessonsData = [
  // Iqra 1
  { id: '1', title: 'Pelajaran 1: Huruf Hijaiyyah', description: 'Mengenal huruf-huruf hijaiyyah asas', iqraLevel: 1, arabicText: 'ا ب ت ث ج ح خ', translation: 'Alif Ba Ta Sa Jim Ha Kha', order: 1 },
  { id: '2', title: 'Pelajaran 2: Baris Fathah', description: 'Membaca huruf dengan baris fathah', iqraLevel: 1, arabicText: 'َا َب َت َث', translation: 'A Ba Ta Sa', order: 2 },
  { id: '3', title: 'Pelajaran 3: Baris Kasrah', description: 'Membaca huruf dengan baris kasrah', iqraLevel: 2, arabicText: 'ِا ِب ِت ِث', translation: 'I Bi Ti Si', order: 3 },
  { id: '4', title: 'Pelajaran 4: Baris Dhammah', description: 'Membaca huruf dengan baris dhammah', iqraLevel: 2, arabicText: 'ُا ُب ُت ُث', translation: 'U Bu Tu Su', order: 4 },
  { id: '5', title: 'Pelajaran 5: Nun Sukun', description: 'Membaca nun sukun dengan huruf hijaiyyah', iqraLevel: 2, arabicText: 'اَن بَن تَن ثَن', translation: 'An Ban Tan Than', order: 5 },
  { id: '6', title: 'Pelajaran 6: Mim Sukun', description: 'Membaca mim sukun dengan huruf hijaiyyah', iqraLevel: 3, arabicText: 'اَم بَم تَم ثَم', translation: 'Am Bam Tam Tham', order: 6 },
  { id: '7', title: 'Pelajaran 7: Tanwin', description: 'Membaca tanwin fathah, kasrah, dhammah', iqraLevel: 3, arabicText: 'اًبِتٌ', translation: 'An Bin Tun', order: 7 },
  { id: '8', title: 'Pelajaran 8: Madd Thabi\'i', description: 'Membaca madd thabi\'i (2 harakat)', iqraLevel: 3, arabicText: 'آ بَا تَا', translation: 'Aba Ba Ta', order: 8 },
  { id: '9', title: 'Pelajaran 9: Qalqalah', description: 'Membaca huruf qalqalah (ب ج د)', iqraLevel: 4, arabicText: 'اَبْ اَجْ اَدْ', translation: 'Ab Aj Ad', order: 9 },
  { id: '10', title: 'Pelajaran 10: Ghunnah', description: 'Membaca ghunnah (نْ مْ)', iqraLevel: 4, arabicText: 'اَنْ اَمْ', translation: 'An Am', order: 10 },
  { id: '11', title: 'Pelajaran 11: Ikhfa', description: 'Membaca ikhfa haqiqi', iqraLevel: 5, arabicText: 'اَنْتَ اَنْسَ', translation: 'Anta Ansa', order: 11 },
  { id: '12', title: 'Pelajaran 12: Idgham', description: 'Membaca idgham', iqraLevel: 5, arabicText: 'مَنْ يَقُوْلُ', translation: 'Man Yaqulu', order: 12 },
  // Iqra 2-6 lessons continue...
];

const badgesData = [
  { id: '1', title: 'Pemula Iqra', description: 'Menyelesaikan 10 pelajaran pertama', iconUrl: '🎯', requirement: '{"type": "lessons", "count": 10}' },
  { id: '2', title: 'Hafiz Muda', description: 'Mencapai skor purata 90% selama 7 hari', iconUrl: '🏆', requirement: '{"type": "score", "value": 90, "days": 7}' },
  { id: '3', title: 'Gigih Berlatih', description: 'Berpelatih selama 30 hari berturut-turut', iconUrl: '🔥', requirement: '{"type": "streak", "days": 30}' },
  { id: '4', title: 'Master Tajwid', description: 'Menyelesaikan semua pelajaran tajwid', iconUrl: '👑', requirement: '{"type": "tajwid", "all": true}' },
  { id: '5', title: 'Quran Star', description: 'Mencapai skor sempurna 100% dalam 5 pelajaran', iconUrl: '⭐', requirement: '{"type": "perfect_scores", "count": 5}' },
  { id: '6', title: 'Voice Master', description: 'Membuat 100 rakaman audio', iconUrl: '🎤', requirement: '{"type": "recordings", "count": 100}' },
];

async function main() {
  console.log('Start seeding...');

  // Create lessons
  for (const lesson of lessonsData) {
    await prisma.lesson.upsert({
      where: { id: lesson.id },
      update: lesson,
      create: lesson,
    });
  }

  // Create badges
  for (const badge of badgesData) {
    await prisma.badge.upsert({
      where: { id: badge.id },
      update: badge,
      create: badge,
    });
  }

  // Create sample user
  const sampleUser = await prisma.user.upsert({
    where: { email: 'ahmad@example.com' },
    update: {},
    create: {
      email: 'ahmad@example.com',
      name: 'Ahmad bin Ismail',
      currentIqraLevel: 3,
      totalPracticeTime: 245,
      currentStreak: 7,
      longestStreak: 15,
    },
  });

  // Create sample progress
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    await prisma.progress.upsert({
      where: {
        userId_date: {
          userId: sampleUser.id,
          date: date,
        },
      },
      update: {},
      create: {
        userId: sampleUser.id,
        date: date,
        iqraLevel: 3,
        averageScore: 80 + Math.random() * 15,
        practiceTime: 30 + Math.floor(Math.random() * 20),
        recordingsCount: 5 + Math.floor(Math.random() * 10),
      },
    });
  }

  // Create sample recordings
  const lessons = await prisma.lesson.findMany({ take: 5 });
  for (const lesson of lessons) {
    await prisma.recording.create({
      data: {
        userId: sampleUser.id,
        lessonId: lesson.id,
        audioUrl: `/recordings/sample-${lesson.id}.webm`,
        score: 75 + Math.random() * 20,
        feedback: `Bagus! Perlu improve pada huruf ${lesson.arabicText.split(' ')[0]}`,
        duration: 30 + Math.floor(Math.random() * 60),
      },
    });
  }

  // Award some badges
  const firstBadge = await prisma.badge.findUnique({ where: { id: '1' } });
  const secondBadge = await prisma.badge.findUnique({ where: { id: '2' } });
  
  if (firstBadge) {
    await prisma.userBadge.upsert({
      where: {
        userId_badgeId: {
          userId: sampleUser.id,
          badgeId: firstBadge.id,
        },
      },
      update: {},
      create: {
        userId: sampleUser.id,
        badgeId: firstBadge.id,
      },
    });
  }

  if (secondBadge) {
    await prisma.userBadge.upsert({
      where: {
        userId_badgeId: {
          userId: sampleUser.id,
          badgeId: secondBadge.id,
        },
      },
      update: {},
      create: {
        userId: sampleUser.id,
        badgeId: secondBadge.id,
      },
    });
  }

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });