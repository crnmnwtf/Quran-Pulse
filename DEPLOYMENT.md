# Quran Pulse - Vercel Deployment Guide

## 🚀 Deploy ke Vercel dari GitHub

### **1. Setup Repository GitHub**

```bash
# Buat repository baru di GitHub
# Repository name: quran-pulse
# Description: Quran Pulse - Digital Iqra Learning Platform
# Public/Private: Pilih mengikut keperluan
```

### **2. Connect GitHub ke Vercel**

1. Pergi ke [vercel.com](https://vercel.com)
2. Login dengan GitHub account
3. Klik "New Project"
4. Pilih repository `quran-pulse` dari GitHub
5. Klik "Import"

### **3. Konfigurasi Environment Variables**

Di Vercel dashboard, tambah environment variables:

```bash
# Production Variables
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secret-key-here
DATABASE_URL=your-database-connection-string
ZAI_API_KEY=your-zai-api-key

# Development Variables (optional)
NODE_ENV=production
```

### **4. Database Setup**

**Option A: Vercel Postgres (Recommended)**
```bash
# Di Vercel dashboard:
# 1. Pergi ke Storage > Create Database
# 2. Pilih Postgres
# 3. Create table atau gunakan Prisma migrate
```

**Option B: External Database**
```bash
# Gunakan database service seperti:
# - Supabase
# - PlanetScale
# - Railway
# - Neon
```

### **5. Deploy Commands**

Vercel akan auto-detect Next.js dan gunakan:

```bash
# Install dependencies
npm install

# Build command
npm run build

# Output directory
.next
```

### **6. Custom Domain (Optional)**

```bash
# Di Vercel dashboard:
# 1. Pergi ke Settings > Domains
# 2. Tambah custom domain
# 3. Update DNS records
```

## 🔧 Vercel Configuration

### **vercel.json** (Sudah disediakan)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["sin1"],
  "env": {
    "NEXT_PUBLIC_APP_URL": "https://quran-pulse.vercel.app",
    "NEXTAUTH_URL": "https://quran-pulse.vercel.app",
    "NEXTAUTH_SECRET": "@nextauth_secret",
    "DATABASE_URL": "@database_url",
    "ZAI_API_KEY": "@zai_api_key"
  }
}
```

### **Features:**
- ✅ Auto-deploy dari GitHub
- ✅ Environment variables
- ✅ Custom headers untuk API
- ✅ Static asset caching
- ✅ Function timeout configuration
- ✅ Singapore region untuk Asia

## 📋 Deployment Checklist

### **Pre-Deployment:**
- [ ] Push semua changes ke GitHub
- [ ] Setup GitHub repository
- [ ] Configure environment variables
- [ ] Setup database
- [ ] Test build locally: `npm run build`

### **Deployment Steps:**
- [ ] Connect GitHub ke Vercel
- [ ] Import repository
- [ ] Configure environment variables
- [ ] Deploy ke production
- [ ] Test deployed application

### **Post-Deployment:**
- [ ] Test semua features
- [ ] Check console untuk errors
- [ ] Monitor performance
- [ ] Setup analytics (optional)

## 🌐 Access URLs

**Production:** `https://quran-pulse.vercel.app`  
**Preview:** `https://quran-pulse-{git-branch}.vercel.app`  
**Custom:** `https://your-domain.com` (jika dikonfigurasi)

## 🔍 Troubleshooting

### **Common Issues:**

**Build Errors:**
```bash
# Check package.json scripts
# Verify TypeScript configuration
# Check for missing dependencies
```

**Environment Variables:**
```bash
# Ensure all required variables are set
# Check variable names match exactly
# Verify database connection string
```

**Database Issues:**
```bash
# Run Prisma migrate: npx prisma migrate deploy
# Check database connection
# Verify schema matches
```

## 📞 Support

Jika ada isu deployment:
1. Check Vercel logs
2. Verify environment variables
3. Test build locally
4. Check GitHub Actions (jika ada)

**Ready to deploy! 🚀**