# Quran Pulse - Manual Vercel Deployment Guide

## 🚀 Deploy dengan Vercel API Key

### **API Key Information:**
```
Vercel API Token: vck_1hCyOoOVN0xRGNasneyl5oJPM6YgDsqpGXXpjmaG13pTLIYnnl3yFhAn
```

### **Method 1: Vercel Web Dashboard (Recommended)**

#### **Step 1: Pergi ke Vercel**
1. Buka [vercel.com](https://vercel.com)
2. Login dengan GitHub account (`crnmnwtf`)
3. Klik "New Project"

#### **Step 2: Import Repository**
1. Cari repository `Quran-Pulse`
2. Klik "Import"

#### **Step 3: Configure Project**
- **Framework**: Next.js (auto-detected)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

#### **Step 4: Environment Variables**
Tambah di Vercel dashboard:
```bash
NEXT_PUBLIC_APP_URL=https://quran-pulse.vercel.app
NEXTAUTH_URL=https://quran-pulse.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret-here
DATABASE_URL=your-database-url-here
ZAI_API_KEY=your-zai-api-key-here
```

#### **Step 5: Deploy**
- Klik "Deploy"
- Tunggu build process (2-3 minit)
- Quran Pulse akan live!

### **Method 2: Vercel CLI**

#### **Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

#### **Step 2: Login dengan Token**
```bash
npx vercel login
# Pilih GitHub
# Atau gunakan token:
export VERCEL_TOKEN="vck_1hCyOoOVN0xRGNasneyl5oJPM6YgDsqpGXXpjmaG13pTLIYnnl3yFhAn"
```

#### **Step 3: Link Project**
```bash
npx vercel link
# Pilih GitHub account: crnmnwtf
# Pilih repository: Quran-Pulse
```

#### **Step 4: Deploy**
```bash
npx vercel --prod
```

### **Method 3: GitHub Actions (Auto-Deploy)**

Repository sudah mempunyai GitHub Actions configuration:

#### **Setup Vercel Secrets:**
1. Pergi ke GitHub repository: `crnmnwtf/Quran-Pulse`
2. Settings → Secrets and variables → Actions
3. Add new repository secrets:

```bash
VERCEL_TOKEN=vck_1hCyOoOVN0xRGNasneyl5oJPM6YgDsqpGXXpjmaG13pTLIYnnl3yFhAn
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id
```

#### **Auto-Deploy:**
- Setiap push ke master branch akan auto-deploy
- CI/CD pipeline akan run tests dan deploy

### **🔍 Get Vercel Organization & Project IDs**

#### **Method A: From Vercel Dashboard**
1. Pergi ke project dashboard di Vercel
2. Settings → General
3. Copy Organization ID dan Project ID

#### **Method B: Using CLI**
```bash
npx vercel projects list
npx vercel orgs list
```

### **📊 Deployment Features**

#### **Performance:**
- Singapore region untuk Asia
- Static asset caching
- CDN distribution
- Edge functions

#### **Security:**
- Environment variables encryption
- HTTPS by default
- Security headers
- CORS configuration

#### **Monitoring:**
- Build logs
- Error tracking
- Performance metrics
- Analytics

### **🌐 Result URLs**

#### **Primary:**
- **Production**: `https://quran-pulse.vercel.app`
- **Custom**: Domain anda sendiri (jika dikonfigurasi)

#### **Preview:**
- **Branch**: `https://quran-pulse-{branch}.vercel.app`
- **Pull Request**: Auto-generated preview URLs

### **🛠️ Troubleshooting**

#### **Build Errors:**
```bash
# Check locally
npm run build

# Check dependencies
npm install

# Verify environment variables
echo $NEXT_PUBLIC_APP_URL
```

#### **Deploy Issues:**
```bash
# Clear Vercel cache
npx vercel rm quran-pulse

# Redeploy
npx vercel --prod
```

#### **Database Issues:**
```bash
# Setup Vercel Postgres
# Atau gunakan external database
# Update DATABASE_URL environment variable
```

### **✅ Pre-Deployment Checklist**

- [ ] Repository pushed ke GitHub
- [ ] Vercel account connected
- [ ] Environment variables set
- [ ] Build passes locally
- [ ] API keys configured
- [ ] Database connected

### **🚀 Ready to Deploy!**

Dengan Vercel API key yang anda berikan, Quran Pulse sudah siap untuk deployment:

1. **Gunakan Method 1** (Web Dashboard) - Paling mudah
2. **Atau Method 2** (CLI) - Lebih control
3. **Atau Method 3** (GitHub Actions) - Auto-deploy

**Quran Pulse akan live dalam beberapa minit!** 🎉

### **📞 Support**

Jika ada isu:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test build locally
4. Check GitHub Actions (jika gunakan auto-deploy)

---
**Repository**: https://github.com/crnmnwtf/Quran-Pulse  
**Vercel Token**: `vck_1hCyOoOVN0xRGNasneyl5oJPM6YgDsqpGXXpjmaG13pTLIYnnl3yFhAn`