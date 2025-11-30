# Quran Pulse

Platform pembelajaran Iqra digital dengan analisis AI dan feedback real-time.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🌟 Features

- **Digital Iqra Books (1-6)** - Buku Iqra digital interaktif
- **AI Audio Analysis** - Analisis pronunciation dengan AI
- **Real-time Feedback** - Maklum balas semasa membaca
- **Progress Tracking** - Sistem tracking kemajuan
- **Tajwid Visualization** - Visualisasi peraturan tajwid
- **Assessment Mode** - Mod ujian dan penilaian
- **Theme Support** - Light/Dark/System modes
- **Responsive Design** - Mobile-friendly interface

## 🎯 Tech Stack

- **Framework**: Next.js 15 dengan App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Database**: Prisma ORM dengan SQLite
- **Authentication**: NextAuth.js v4
- **State Management**: Zustand + TanStack Query
- **AI Integration**: ZAI Web Dev SDK
- **Theme**: next-themes

## 📱 Usage

1. **Buka aplikasi** di `http://localhost:3000`
2. **Pilih theme** (Light/Dark/System) dengan klik butang theme di header
3. **Mula belajar** dengan pilih Iqra 1-6 dari tab "Pelajaran"
4. **Rakam bacaan** dan dapatkan analisis AI
5. **Track progress** melalui dashboard

## 🚀 Deployment

### Vercel (Recommended)

1. **Fork repository** ini
2. **Import ke Vercel** dari GitHub
3. **Setup environment variables**:
   ```
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=your-secret-key
   DATABASE_URL=your-database-connection-string
   ZAI_API_KEY=your-zai-api-key
   ```
4. **Deploy** - Vercel akan auto-detect Next.js

### Manual Deployment

```bash
# Build application
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── ui/            # shadcn/ui components
│   ├── theme-provider.tsx
│   ├── theme-toggle.tsx
│   └── ...
├── lib/               # Utilities and configurations
├── hooks/             # Custom React hooks
├── styles/            # Additional styles
└── types/             # TypeScript type definitions
```

## 🎨 Theme Support

Aplikasi menyokong 3 theme modes:

- **Light Mode** - Interface cerah dan bersih
- **Dark Mode** - Mesra mata untuk pembelajaran malam
- **System Mode** - Ikut preferensi OS

Gunakan butang theme toggle (🌙/☀️) di header untuk tukar theme.

## 🔧 Environment Variables

```bash
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Database
DATABASE_URL="file:./dev.db"

# AI Services
ZAI_API_KEY=your-zai-api-key
```

## 📊 Features Detail

### Digital Iqra Books
- 6 levels (Iqra 1-6)
- 12 lessons per level
- Interactive Arabic text
- Audio recording per lesson
- Progress tracking
- Tajwid visualization

### AI Analysis
- Pronunciation scoring
- Real-time feedback
- Error detection
- Improvement suggestions
- Progress analytics

### Gamification
- Badge system
- Streak tracking
- Progress charts
- Achievement certificates
- Leaderboard

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue in GitHub
- Check the [Deployment Guide](DEPLOYMENT.md)
- Review the documentation

---

**Quran Pulse** - Membuat pembelajaran Iqra lebih interaktif dan berkesan dengan AI! 📖✨