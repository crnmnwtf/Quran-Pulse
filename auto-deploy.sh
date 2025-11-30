#!/bin/bash

# Quran Pulse - Auto Deployment Script
echo "🚀 Quran Pulse Auto Deployment to Vercel"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="quran-pulse"
GITHUB_REPO="crnmnwtf/Quran-Pulse"
VERCEL_TOKEN="vck_1hCyOoOVN0xRGNasneyl5oJPM6YgDsqpGXXpjmaG13pTLIYnnl3yFhAn"
GLM_API_KEY="e785716f55ce4b97b0e3705168cfe29d.j0GJj40OLerXMt1l"

echo -e "${YELLOW}📋 Configuration:${NC}"
echo -e "  Project: ${PROJECT_NAME}"
echo -e "  Repository: ${GITHUB_REPO}"
echo -e "  Vercel Token: ${VERCEL_TOKEN:0:20}..."
echo -e "  GLM API Key: ${GLM_API_KEY:0:20}..."

# Step 1: Check if everything is committed
echo -e "${YELLOW}🔍 Checking git status...${NC}"
if [[ -n $(git status --porcelain) ]]; then
    echo -e "${RED}❌ There are uncommitted changes${NC}"
    git add .
    git commit -m "Auto-commit before deployment"
    git push origin master
else
    echo -e "${GREEN}✅ All changes committed${NC}"
fi

# Step 2: Create deployment via Vercel API
echo -e "${YELLOW}🚀 Creating deployment...${NC}"

DEPLOY_RESPONSE=$(curl -s -X POST \
    -H "Authorization: Bearer ${VERCEL_TOKEN}" \
    -H "Content-Type: application/json" \
    -d "{
        \"name\": \"${PROJECT_NAME}\",
        \"framework\": \"nextjs\",
        \"gitSource\": {
            \"type\": \"github\",
            \"repo\": {
                \"owner\": \"crnmnwtf\",
                \"name\": \"Quran-Pulse\",
                \"ref\": \"master\"
            }
        },
        \"target\": \"production\",
        \"env\": {
            \"NEXT_PUBLIC_APP_URL\": \"https://quran-pulse.vercel.app\",
            \"NEXTAUTH_URL\": \"https://quran-pulse.vercel.app\",
            \"GLM_API_KEY\": \"${GLM_API_KEY}\"
        }
    }" \
    "https://api.vercel.com/v13/deployments")

echo -e "${YELLOW}📄 Deployment response:${NC}"
echo "$DEPLOY_RESPONSE" | head -c 500

# Check if deployment was created
if echo "$DEPLOY_RESPONSE" | grep -q '"id"'; then
    DEPLOY_ID=$(echo "$DEPLOY_RESPONSE" | grep -o '"id":"[^"]*' | cut -d'"' -f2)
    DEPLOY_URL=$(echo "$DEPLOY_RESPONSE" | grep -o '"url":"[^"]*' | cut -d'"' -f2)
    
    echo -e "${GREEN}✅ Deployment created successfully!${NC}"
    echo -e "  Deployment ID: ${DEPLOY_ID}"
    echo -e "  Deployment URL: ${DEPLOY_URL}"
    
    # Monitor deployment
    echo -e "${YELLOW}⏳ Monitoring deployment...${NC}"
    
    for i in {1..30}; do
        sleep 10
        
        STATUS_RESPONSE=$(curl -s -H "Authorization: Bearer ${VERCEL_TOKEN}" \
                              "https://api.vercel.com/v13/deployments/${DEPLOY_ID}")
        
        STATUS=$(echo "$STATUS_RESPONSE" | grep -o '"readyState":"[^"]*' | cut -d'"' -f2)
        
        case $STATUS in
            "QUEUED")
                echo -e "${YELLOW}⏳ Deployment queued... (${i}/30)${NC}"
                ;;
            "BUILDING")
                echo -e "${YELLOW}🔨 Building deployment... (${i}/30)${NC}"
                ;;
            "READY")
                echo -e "${GREEN}✅ Deployment ready!${NC}"
                FINAL_URL=$(echo "$STATUS_RESPONSE" | grep -o '"url":"[^"]*' | cut -d'"' -f4)
                echo -e "${GREEN}🌍 Your Quran Pulse app is live at: ${FINAL_URL}${NC}"
                
                # Success message
                echo -e "${GREEN}"
                echo "🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉"
                echo "   QURAN PULSE DEPLOYMENT SUCCESSFUL!"
                echo "🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉"
                echo -e "${NC}"
                
                echo -e "${YELLOW}📱 App Features:${NC}"
                echo "  🎨 Theme Support (Light/Dark/System)"
                echo "  📚 Digital Iqra Books 1-6"
                echo "  🎤 AI Audio Analysis (GLM Powered)"
                echo "  📊 Progress Dashboard"
                echo "  🏆 Badge & Achievement System"
                echo "  🎯 Assessment Mode"
                echo "  📖 Tajwid Visualization"
                echo "  🌐 Responsive Design"
                
                echo -e "${YELLOW}🔗 Links:${NC}"
                echo "  🌍 Live App: ${FINAL_URL}"
                echo "  📚 GitHub: https://github.com/${GITHUB_REPO}"
                echo "  ⚙️  Vercel: https://vercel.com"
                
                exit 0
                ;;
            "ERROR")
                echo -e "${RED}❌ Deployment failed${NC}"
                echo "$STATUS_RESPONSE" | head -c 1000
                exit 1
                ;;
            *)
                echo -e "${YELLOW}⏳ Status: ${STATUS} (${i}/30)${NC}"
                ;;
        esac
    done
    
    echo -e "${RED}❌ Deployment timeout${NC}"
    exit 1
else
    echo -e "${RED}❌ Failed to create deployment${NC}"
    echo "$DEPLOY_RESPONSE"
    exit 1
fi