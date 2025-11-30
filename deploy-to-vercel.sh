#!/bin/bash

# Quran Pulse - Vercel Deployment Script
# This script deploys the project to Vercel using API

echo "🚀 Deploying Quran Pulse to Vercel..."

# Configuration
VERCEL_TOKEN="vck_1hCyOoOVN0xRGNasneyl5oJPM6YgDsqpGXXpjmaG13pTLIYnnl3yFhAn"
PROJECT_NAME="quran-pulse"
GITHUB_REPO="crnmnwtf/Quran-Pulse"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📝 Configuration:${NC}"
echo -e "  Project: ${PROJECT_NAME}"
echo -e "  Repository: ${GITHUB_REPO}"
echo -e "  Token: ${VERCEL_TOKEN:0:20}..."

# Function to create or get project
create_project() {
    echo -e "${YELLOW}🔗 Creating/Getting Vercel project...${NC}"
    
    # Try to get existing project
    RESPONSE=$(curl -s -H "Authorization: Bearer $VERCEL_TOKEN" \
                   "https://api.vercel.com/v9/projects/${PROJECT_NAME}")
    
    if [[ $RESPONSE == *"id"* ]]; then
        echo -e "${GREEN}✅ Project already exists${NC}"
        PROJECT_ID=$(echo $RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)
        echo -e "  Project ID: ${PROJECT_ID}"
    else
        echo -e "${YELLOW}🆕 Creating new project...${NC}"
        
        # Create new project
        CREATE_RESPONSE=$(curl -s -X POST \
            -H "Authorization: Bearer $VERCEL_TOKEN" \
            -H "Content-Type: application/json" \
            -d "{
                \"name\": \"${PROJECT_NAME}\",
                \"framework\": \"nextjs\",
                \"gitRepository\": {
                    \"repo\": \"${GITHUB_REPO}\",
                    \"type\": \"github\"
                }
            }" \
            "https://api.vercel.com/v9/projects")
        
        if [[ $CREATE_RESPONSE == *"id"* ]]; then
            PROJECT_ID=$(echo $CREATE_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)
            echo -e "${GREEN}✅ Project created successfully${NC}"
            echo -e "  Project ID: ${PROJECT_ID}"
        else
            echo -e "${RED}❌ Failed to create project${NC}"
            echo -e "  Response: ${CREATE_RESPONSE}"
            exit 1
        fi
    fi
}

# Function to create deployment
create_deployment() {
    echo -e "${YELLOW}🚀 Creating deployment...${NC}"
    
    # Create deployment
    DEPLOY_RESPONSE=$(curl -s -X POST \
        -H "Authorization: Bearer $VERCEL_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"name\": \"${PROJECT_NAME}\",
            \"project\": \"${PROJECT_ID}\",
            \"target\": \"production\",
            \"gitSource\": {
                \"type\": \"github\",
                \"repo\": {
                    \"owner\": \"crnmnwtf\",
                    \"name\": \"Quran-Pulse\",
                    \"ref\": \"master\"
                }
            },
            \"env\": {
                \"NEXT_PUBLIC_APP_URL\": \"https://quran-pulse.vercel.app\",
                \"NEXTAUTH_URL\": \"https://quran-pulse.vercel.app\",
                \"GLM_API_KEY\": \"e785716f55ce4b97b0e3705168cfe29d.j0GJj40OLerXMt1l\"
            }
        }" \
        "https://api.vercel.com/v13/deployments")
    
    if [[ $DEPLOY_RESPONSE == *"id"* ]]; then
        DEPLOY_ID=$(echo $DEPLOY_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)
        DEPLOY_URL=$(echo $DEPLOY_RESPONSE | grep -o '"url":"[^"]*' | cut -d'"' -f4)
        
        echo -e "${GREEN}✅ Deployment created successfully${NC}"
        echo -e "  Deployment ID: ${DEPLOY_ID}"
        echo -e "  Deployment URL: ${DEPLOY_URL}"
        
        # Monitor deployment
        monitor_deployment $DEPLOY_ID
    else
        echo -e "${RED}❌ Failed to create deployment${NC}"
        echo -e "  Response: ${DEPLOY_RESPONSE}"
        exit 1
    fi
}

# Function to monitor deployment
monitor_deployment() {
    local DEPLOY_ID=$1
    echo -e "${BLUE}📊 Monitoring deployment: ${DEPLOY_ID}${NC}"
    
    while true; do
        STATUS_RESPONSE=$(curl -s -H "Authorization: Bearer $VERCEL_TOKEN" \
                              "https://api.vercel.com/v13/deployments/${DEPLOY_ID}")
        
        STATUS=$(echo $STATUS_RESPONSE | grep -o '"readyState":"[^"]*' | cut -d'"' -f4)
        
        case $STATUS in
            "QUEUED")
                echo -e "${YELLOW}⏳ Deployment queued...${NC}"
                ;;
            "BUILDING")
                echo -e "${YELLOW}🔨 Building deployment...${NC}"
                ;;
            "READY")
                echo -e "${GREEN}✅ Deployment ready!${NC}"
                FINAL_URL=$(echo $STATUS_RESPONSE | grep -o '"url":"[^"]*' | cut -d'"' -f4)
                echo -e "${GREEN}🌍 Your app is live at: ${FINAL_URL}${NC}"
                break
                ;;
            "ERROR")
                echo -e "${RED}❌ Deployment failed${NC}"
                echo -e "  Response: ${STATUS_RESPONSE}"
                exit 1
                ;;
            *)
                echo -e "${YELLOW}⏳ Status: ${STATUS}${NC}"
                ;;
        esac
        
        sleep 5
    done
}

# Main execution
main() {
    echo -e "${BLUE}🎯 Starting Quran Pulse deployment to Vercel...${NC}"
    
    create_project
    create_deployment
    
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    echo -e "${GREEN}🌍 Your Quran Pulse app is now live!${NC}"
}

# Run main function
main