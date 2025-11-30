#!/bin/bash

# Quran Pulse - Simple Double Deployment
echo "🚀 Quran Pulse Double Deployment"

VERCEL_TOKEN="vck_1hCyOoOVN0xRGNasneyl5oJPM6YgDsqpGXXpjmaG13pTLIYnnl3yFhAn"
GLM_API_KEY="e785716f55ce4b97b0e3705168cfe29d.j0GJj40OLerXMt1l"

# Create Primary Deployment
echo "📦 Creating Primary Deployment..."
PRIMARY_RESPONSE=$(curl -s -X POST \
    -H "Authorization: Bearer $VERCEL_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "name": "quran-pulse-primary",
        "framework": "nextjs",
        "gitSource": {
            "type": "github",
            "repo": {
                "owner": "crnmnwtf",
                "name": "Quran-Pulse"
            },
            "ref": "master"
        },
        "target": "production",
        "env": {
            "NEXT_PUBLIC_APP_URL": "https://quran-pulse-primary.vercel.app",
            "NEXTAUTH_URL": "https://quran-pulse-primary.vercel.app",
            "GLM_API_KEY": "'$GLM_API_KEY'"
        }
    }' \
    https://api.vercel.com/v13/deployments)

if echo "$PRIMARY_RESPONSE" | grep -q '"id"'; then
    PRIMARY_ID=$(echo "$PRIMARY_RESPONSE" | grep -o '"id":"[^"]*' | cut -d'"' -f2)
    echo "✅ Primary deployment created: $PRIMARY_ID"
else
    echo "❌ Primary deployment failed"
    echo "$PRIMARY_RESPONSE"
fi

# Wait for primary deployment
echo "⏳ Waiting for primary deployment..."
sleep 30

# Create Backup Deployment
echo "📦 Creating Backup Deployment..."
BACKUP_RESPONSE=$(curl -s -X POST \
    -H "Authorization: Bearer $VERCEL_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "name": "quran-pulse-backup",
        "framework": "nextjs",
        "gitSource": {
            "type": "github",
            "repo": {
                "owner": "crnmnwtf",
                "name": "Quran-Pulse"
            },
            "ref": "master"
        },
        "target": "production",
        "env": {
            "NEXT_PUBLIC_APP_URL": "https://quran-pulse-backup.vercel.app",
            "NEXTAUTH_URL": "https://quran-pulse-backup.vercel.app",
            "GLM_API_KEY": "'$GLM_API_KEY'"
        }
    }' \
    https://api.vercel.com/v13/deployments)

if echo "$BACKUP_RESPONSE" | grep -q '"id"'; then
    BACKUP_ID=$(echo "$BACKUP_RESPONSE" | grep -o '"id":"[^"]*' | cut -d'"' -f2)
    echo "✅ Backup deployment created: $BACKUP_ID"
else
    echo "❌ Backup deployment failed"
    echo "$BACKUP_RESPONSE"
fi

echo "🎉 Double deployment initiated!"
echo "🌍 Primary: https://quran-pulse-primary.vercel.app"
echo "🌍 Backup: https://quran-pulse-backup.vercel.app"