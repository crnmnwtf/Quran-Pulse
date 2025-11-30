#!/bin/bash

# Quran Pulse - Vercel Deployment Script
# Usage: ./deploy.sh

echo "🚀 Deploying Quran Pulse to Vercel..."

# Set Vercel token
export VERCEL_TOKEN="vck_1hCyOoOVN0xRGNasneyl5oJPM6YgDsqpGXXpjmaG13pTLIYnnl3yFhAn"

# Login to Vercel
echo "📝 Logging into Vercel..."
npx vercel --token $VERCEL_TOKEN login

# Link project
echo "🔗 Linking project to Vercel..."
npx vercel --token $VERCEL_TOKEN link

# Deploy to production
echo "🌐 Deploying to production..."
npx vercel --token $VERCEL_TOKEN --prod

echo "✅ Deployment complete!"
echo "🌍 Your app is now live at: https://quran-pulse.vercel.app"