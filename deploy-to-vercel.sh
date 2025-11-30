#!/bin/bash

# Quran Pulse - Vercel Deployment Script
echo "🚀 Deploying Quran Pulse to Vercel from GitHub..."

# Configuration
VERCEL_TOKEN="vck_1hCyOoOVN0xRGNasneyl5oJPM6YgDsqpGXXpjmaG13pTLIYnnl3yFhAn"
GITHUB_OWNER="crnmnwtf"
GITHUB_REPO="Quran-Pulse"
PROJECT_NAME="quran-pulse"

echo "📋 Configuration:"
echo "  Project: $PROJECT_NAME"
echo "  Repository: $GITHUB_OWNER/$GITHUB_REPO"
echo "  Token: ${VERCEL_TOKEN:0:20}..."

# Step 1: Create or get project
echo "🔗 Setting up project..."
PROJECT_RESPONSE=$(curl -s -X GET \
    -H "Authorization: Bearer $VERCEL_TOKEN" \
    "https://api.vercel.com/v9/projects/$PROJECT_NAME")

if echo "$PROJECT_RESPONSE" | grep -q '"id"'; then
    echo "✅ Project exists"
    PROJECT_ID=$(echo "$PROJECT_RESPONSE" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
else
    echo "🆕 Creating new project..."
    CREATE_RESPONSE=$(curl -s -X POST \
        -H "Authorization: Bearer $VERCEL_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"name\": \"$PROJECT_NAME\",
            \"framework\": \"nextjs\",
            \"gitRepository\": {
                \"repo\": \"$GITHUB_OWNER/$GITHUB_REPO\",
                \"type\": \"github\"
            }
        }" \
        "https://api.vercel.com/v9/projects")
    
    if echo "$CREATE_RESPONSE" | grep -q '"id"'; then
        PROJECT_ID=$(echo "$CREATE_RESPONSE" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
        echo "✅ Project created: $PROJECT_ID"
    else
        echo "❌ Failed to create project"
        echo "$CREATE_RESPONSE"
        exit 1
    fi
fi

# Step 2: Create deployment
echo "🚀 Creating deployment..."
DEPLOY_RESPONSE=$(curl -s -X POST \
    -H "Authorization: Bearer $VERCEL_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
        \"name\": \"$PROJECT_NAME\",
        \"project\": \"$PROJECT_ID\",
        \"target\": \"production\",
        \"gitSource\": {
            \"type\": \"github\",
            \"repo\": {
                \"owner\": \"$GITHUB_OWNER\",
                \"name\": \"$GITHUB_REPO\",
                \"ref\": \"master\"
            }
        },
        \"env\": {
            \"NEXT_PUBLIC_APP_URL\": \"https://$PROJECT_NAME.vercel.app\",
            \"NEXTAUTH_URL\": \"https://$PROJECT_NAME.vercel.app\",
            \"GLM_API_KEY\": \"e785716f55ce4b97b0e3705168cfe29d.j0GJj40OLerXMt1l\"
        }
    }" \
    "https://api.vercel.com/v13/deployments")

if echo "$DEPLOY_RESPONSE" | grep -q '"id"'; then
    DEPLOY_ID=$(echo "$DEPLOY_RESPONSE" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
    DEPLOY_URL=$(echo "$DEPLOY_RESPONSE" | grep -o '"url":"[^"]*' | cut -d'"' -f4)
    
    echo "✅ Deployment created!"
    echo "  Deployment ID: $DEPLOY_ID"
    echo "  Deployment URL: $DEPLOY_URL"
    
    # Step 3: Monitor deployment
    echo "⏳ Monitoring deployment..."
    
    for i in {1..60}; do
        sleep 5
        
        STATUS_RESPONSE=$(curl -s -H "Authorization: Bearer $VERCEL_TOKEN" \
                              "https://api.vercel.com/v13/deployments/$DEPLOY_ID")
        
        STATUS=$(echo "$STATUS_RESPONSE" | grep -o '"readyState":"[^"]*' | cut -d'"' -f4)
        
        case $STATUS in
            "QUEUED")
                echo "⏳ Deployment queued... ($i/60)"
                ;;
            "BUILDING")
                echo "🔨 Building deployment... ($i/60)"
                ;;
            "READY")
                echo "✅ Deployment ready!"
                FINAL_URL=$(echo "$STATUS_RESPONSE" | grep -o '"url":"[^"]*' | cut -d'"' -f4)
                
                echo ""
                echo "🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉"
                echo "   QURAN PULSE DEPLOYMENT SUCCESSFUL!"
                echo "🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉"
                echo ""
                echo "🌍 Your app is live at: $FINAL_URL"
                echo ""
                echo "📱 Features Available:"
                echo "  🎨 Theme Support (Light/Dark/System)"
                echo "  📚 Digital Iqra Books 1-6"
                echo "  🎤 AI Audio Analysis (GLM Powered)"
                echo "  📊 Progress Dashboard"
                echo "  🏆 Badge & Achievement System"
                echo "  🎯 Assessment Mode"
                echo "  📖 Tajwid Visualization"
                echo ""
                echo "🔗 Important Links:"
                echo "  🌍 Live App: $FINAL_URL"
                echo "  📚 GitHub: https://github.com/$GITHUB_OWNER/$GITHUB_REPO"
                echo "  ⚙️  Vercel: https://vercel.com"
                echo ""
                
                exit 0
                ;;
            "ERROR")
                echo "❌ Deployment failed"
                echo "$STATUS_RESPONSE" | head -c 1000
                exit 1
                ;;
            *)
                echo "⏳ Status: $STATUS ($i/60)"
                ;;
        esac
    done
    
    echo "❌ Deployment timeout"
    exit 1
else
    echo "❌ Failed to create deployment"
    echo "$DEPLOY_RESPONSE"
    exit 1
fi