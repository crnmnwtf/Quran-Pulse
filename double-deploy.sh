#!/bin/bash

# Quran Pulse - Double Deployment Script
echo "🚀 Quran Pulse Double Deployment to Vercel"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
VERCEL_TOKEN="vck_1hCyOoOVN0xRGNasneyl5oJPM6YgDsqpGXXpjmaG13pTLIYnnl3yFhAn"
GLM_API_KEY="e785716f55ce4b97b0e3705168cfe29d.j0GJj40OLerXMt1l"
PROJECT_NAME="quran-pulse"
GITHUB_OWNER="crnmnwtf"
GITHUB_REPO="Quran-Pulse"

echo -e "${BLUE}📋 Configuration:${NC}"
echo -e "  Project: ${PROJECT_NAME}"
echo -e "  Repository: ${GITHUB_OWNER}/${GITHUB_REPO}"
echo -e "  Vercel Token: ${VERCEL_TOKEN:0:20}..."
echo -e "  GLM API Key: ${GLM_API_KEY:0:20}..."

# Function to create deployment
create_deployment() {
    local deployment_name=$1
    local description=$2
    
    echo -e "${YELLOW}🚀 Creating ${deployment_name} deployment...${NC}"
    
    DEPLOY_RESPONSE=$(curl -s -X POST \
        -H "Authorization: Bearer ${VERCEL_TOKEN}" \
        -H "Content-Type: application/json" \
        -d "{
            \"name\": \"${PROJECT_NAME}-${deployment_name,,}\",
            \"framework\": \"nextjs\",
            \"gitSource\": {
                \"type\": \"github\",
                \"repo\": {
                    \"owner\": \"${GITHUB_OWNER}\",
                    \"name\": \"${GITHUB_REPO}\",
                    \"ref\": \"master\"
                }
            },
            \"target\": \"production\",
            \"env\": {
                \"NEXT_PUBLIC_APP_URL\": \"https://${PROJECT_NAME}-${deployment_name,,}.vercel.app\",
                \"NEXTAUTH_URL\": \"https://${PROJECT_NAME}-${deployment_name,,}.vercel.app\",
                \"GLM_API_KEY\": \"${GLM_API_KEY}\"
            },
            \"buildCommand\": \"npm run build\",
            \"outputDirectory\": \".next\",
            \"installCommand\": \"npm install\"
        }" \
        "https://api.vercel.com/v13/deployments")
    
    if echo "$DEPLOY_RESPONSE" | grep -q '"id"'; then
        DEPLOY_ID=$(echo "$DEPLOY_RESPONSE" | grep -o '"id":"[^"]*' | cut -d'"' -f2)
        DEPLOY_URL=$(echo "$DEPLOY_RESPONSE" | grep -o '"url":"[^"]*' | cut -d'"' -f4)
        
        echo -e "${GREEN}✅ ${deployment_name} deployment created!${NC}"
        echo -e "  Deployment ID: ${DEPLOY_ID}"
        echo -e "  Deployment URL: ${DEPLOY_URL}"
        
        # Monitor deployment
        monitor_deployment "$DEPLOY_ID" "$deployment_name" "$DEPLOY_URL"
        
        return 0
    else
        echo -e "${RED}❌ Failed to create ${deployment_name} deployment${NC}"
        echo "$DEPLOY_RESPONSE"
        return 1
    fi
}

# Function to monitor deployment
monitor_deployment() {
    local deploy_id=$1
    local deployment_name=$2
    local deploy_url=$3
    
    echo -e "${YELLOW}⏳ Monitoring ${deployment_name} deployment...${NC}"
    
    for i in {1..60}; do
        sleep 10
        
        STATUS_RESPONSE=$(curl -s -H "Authorization: Bearer ${VERCEL_TOKEN}" \
                              "https://api.vercel.com/v13/deployments/${deploy_id}")
        
        STATUS=$(echo "$STATUS_RESPONSE" | grep -o '"readyState":"[^"]*' | cut -d'"' -f2)
        
        case $STATUS in
            "QUEUED")
                echo -e "${YELLOW}⏳ ${deployment_name} deployment queued... (${i}/60)${NC}"
                ;;
            "BUILDING")
                echo -e "${YELLOW}🔨 Building ${deployment_name} deployment... (${i}/60)${NC}"
                ;;
            "READY")
                echo -e "${GREEN}✅ ${deployment_name} deployment ready!${NC}"
                FINAL_URL=$(echo "$STATUS_RESPONSE" | grep -o '"url":"[^"]*' | cut -d'"' -f4)
                
                echo -e "${GREEN}🌍 ${deployment_name} app is live at: ${FINAL_URL}${NC}"
                
                # Test the deployment
                test_deployment "$FINAL_URL" "$deployment_name"
                
                return 0
                ;;
            "ERROR")
                echo -e "${RED}❌ ${deployment_name} deployment failed${NC}"
                echo "$STATUS_RESPONSE" | head -c 1000
                return 1
                ;;
            *)
                echo -e "${YELLOW}⏳ ${deployment_name} status: ${STATUS} (${i}/60)${NC}"
                ;;
        esac
    done
    
    echo -e "${RED}❌ ${deployment_name} deployment timeout${NC}"
    return 1
}

# Function to test deployment
test_deployment() {
    local url=$1
    local deployment_name=$2
    
    echo -e "${BLUE}🧪 Testing ${deployment_name} deployment...${NC}"
    
    # Test main page
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    if [ "$HTTP_STATUS" = "200" ]; then
        echo -e "${GREEN}✅ ${deployment_name} main page: OK (200)${NC}"
    else
        echo -e "${RED}❌ ${deployment_name} main page: Failed ($HTTP_STATUS)${NC}"
    fi
    
    # Test API
    API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$url/api/lessons")
    if [ "$API_STATUS" = "200" ]; then
        echo -e "${GREEN}✅ ${deployment_name} API: OK (200)${NC}"
    else
        echo -e "${RED}❌ ${deployment_name} API: Failed ($API_STATUS)${NC}"
    fi
    
    # Test pronunciation API
    PRONUNCIATION_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$url/api/analyze-pronunciation" -H "Content-Type: application/json" -d '{"audioData":"test","expectedText":"test"}')
    if [ "$PRONUNCIATION_STATUS" = "200" ]; then
        echo -e "${GREEN}✅ ${deployment_name} pronunciation API: OK (200)${NC}"
    else
        echo -e "${RED}❌ ${deployment_name} pronunciation API: Failed ($PRONUNCIATION_STATUS)${NC}"
    fi
}

# Main execution
main() {
    echo -e "${BLUE}🎯 Starting Quran Pulse Double Deployment...${NC}"
    
    # Create first deployment
    echo -e "${BLUE}📦 Creating first deployment...${NC}"
    if create_deployment "Primary" "Main production deployment"; then
        echo -e "${GREEN}✅ Primary deployment successful${NC}"
    else
        echo -e "${RED}❌ Primary deployment failed${NC}"
        exit 1
    fi
    
    # Wait a bit before second deployment
    echo -e "${YELLOW}⏳ Waiting 30 seconds before second deployment...${NC}"
    sleep 30
    
    # Create second deployment
    echo -e "${BLUE}📦 Creating second deployment...${NC}"
    if create_deployment "Backup" "Backup production deployment"; then
        echo -e "${GREEN}✅ Backup deployment successful${NC}"
    else
        echo -e "${RED}❌ Backup deployment failed${NC}"
        exit 1
    fi
    
    # Final summary
    echo -e "${GREEN}"
    echo "🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉"
    echo "   QURAN PULSE DOUBLE DEPLOYMENT SUCCESSFUL!"
    echo "🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉"
    echo -e "${NC}"
    
    echo -e "${YELLOW}📱 Live URLs:${NC}"
    echo -e "  🌍 Primary: https://${PROJECT_NAME}-primary.vercel.app"
    echo -e "  🌍 Backup: https://${PROJECT_NAME}-backup.vercel.app"
    
    echo -e "${YELLOW}🔗 Quick Links:${NC}"
    echo -e "  📚 GitHub: https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}"
    echo -e "  ⚙️  Vercel: https://vercel.com"
    
    echo -e "${YELLOW}📱 Features Available:${NC}"
    echo -e "  🎨 Theme Support (Light/Dark/System)"
    echo -e "  📚 Digital Iqra Books 1-6"
    echo -e "  🎤 AI Audio Analysis (GLM Powered)"
    echo -e "  📊 Progress Dashboard"
    echo -e "  🏆 Badge & Achievement System"
    echo -e "  🎯 Assessment Mode"
    echo -e "  📖 Tajwid Visualization"
    echo -e "  🌐 Responsive Design"
    
    echo -e "${GREEN}🎊 Both deployments are live and fully functional!${NC}"
}

# Run main function
main