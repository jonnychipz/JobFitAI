#!/bin/bash
# Get or create Azure service principal for GitHub Actions

set -e

APP_NAME="github-jobfitai-oidc"
REPO_OWNER="jonnychipz"
REPO_NAME="JobFitAI"

echo "🔍 Checking for existing service principal..."
echo "=============================================="
echo ""

# Check if app exists
APP_ID=$(az ad app list --display-name "$APP_NAME" --query "[0].appId" -o tsv 2>/dev/null)

if [ -z "$APP_ID" ]; then
    echo "❌ Service principal '$APP_NAME' not found"
    echo ""
    echo "📝 Would you like to create it? (y/n)"
    read -r response
    
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo ""
        echo "🔧 Creating service principal..."
        
        # Get subscription ID
        SUBSCRIPTION_ID=$(az account show --query id -o tsv)
        
        # Create app
        az ad app create --display-name "$APP_NAME" > /dev/null
        APP_ID=$(az ad app list --display-name "$APP_NAME" --query "[0].appId" -o tsv)
        
        # Create service principal
        az ad sp create --id "$APP_ID" > /dev/null
        
        # Configure OIDC for main branch
        az ad app federated-credential create \
          --id "$APP_ID" \
          --parameters "{
            \"name\": \"github-jobfitai-main\",
            \"issuer\": \"https://token.actions.githubusercontent.com\",
            \"subject\": \"repo:$REPO_OWNER/$REPO_NAME:ref:refs/heads/main\",
            \"audiences\": [\"api://AzureADTokenExchange\"]
          }" > /dev/null
        
        # Configure OIDC for PRs
        az ad app federated-credential create \
          --id "$APP_ID" \
          --parameters "{
            \"name\": \"github-jobfitai-pr\",
            \"issuer\": \"https://token.actions.githubusercontent.com\",
            \"subject\": \"repo:$REPO_OWNER/$REPO_NAME:pull_request\",
            \"audiences\": [\"api://AzureADTokenExchange\"]
          }" > /dev/null
        
        # Assign Contributor role
        az role assignment create \
          --assignee "$APP_ID" \
          --role Contributor \
          --scope "/subscriptions/$SUBSCRIPTION_ID" > /dev/null
        
        # Assign User Access Administrator role
        az role assignment create \
          --assignee "$APP_ID" \
          --role "User Access Administrator" \
          --scope "/subscriptions/$SUBSCRIPTION_ID" > /dev/null
        
        echo "✅ Service principal created successfully!"
    else
        echo "Cancelled."
        exit 0
    fi
else
    echo "✅ Found existing service principal: $APP_NAME"
fi

TENANT_ID=$(az account show --query tenantId -o tsv)
SUBSCRIPTION_ID=$(az account show --query id -o tsv)

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 GitHub Secrets Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Add these secrets to GitHub:"
echo "  Repository → Settings → Secrets and variables → Actions → New repository secret"
echo ""
echo "AZURE_CLIENT_ID:"
echo "  $APP_ID"
echo ""
echo "AZURE_TENANT_ID:"
echo "  $TENANT_ID"
echo ""
echo "AZURE_SUBSCRIPTION_ID:"
echo "  $SUBSCRIPTION_ID"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔧 Next: Grant backend access"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Run this command to grant state backend access:"
echo ""
echo "  ./grant-backend-access.sh $APP_ID"
echo ""
