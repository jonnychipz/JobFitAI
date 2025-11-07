#!/bin/bash

# Setup GitHub Secrets for JobFitAI Deployment
# This script creates an Azure Service Principal with OIDC for GitHub Actions

set -e

echo "🚀 Setting up GitHub Actions authentication for JobFitAI"
echo ""

# Configuration
REPO_OWNER="jonnychipz"  # Your GitHub username
REPO_NAME="JobFitAI"
APP_NAME="github-jobfitai-deployer"

# Get Azure subscription info
echo "📋 Getting Azure subscription information..."
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
TENANT_ID=$(az account show --query tenantId -o tsv)

echo "Subscription ID: $SUBSCRIPTION_ID"
echo "Tenant ID: $TENANT_ID"
echo ""

# Create App Registration
echo "🔐 Creating Azure AD App Registration..."
az ad app create --display-name "$APP_NAME" --query appId -o tsv > /tmp/app_id.txt
APP_ID=$(cat /tmp/app_id.txt)
echo "App ID (Client ID): $APP_ID"
echo ""

# Create Service Principal
echo "👤 Creating Service Principal..."
az ad sp create --id "$APP_ID"
sleep 10  # Wait for SP to propagate
echo ""

# Configure OIDC Federated Credentials for main branch
echo "🔗 Configuring OIDC federated credentials for main branch..."
az ad app federated-credential create \
  --id "$APP_ID" \
  --parameters "{
    \"name\": \"github-jobfitai-main\",
    \"issuer\": \"https://token.actions.githubusercontent.com\",
    \"subject\": \"repo:${REPO_OWNER}/${REPO_NAME}:ref:refs/heads/main\",
    \"audiences\": [\"api://AzureADTokenExchange\"]
  }"
echo "✅ Main branch OIDC configured"
echo ""

# Configure OIDC Federated Credentials for pull requests
echo "🔗 Configuring OIDC federated credentials for pull requests..."
az ad app federated-credential create \
  --id "$APP_ID" \
  --parameters "{
    \"name\": \"github-jobfitai-pr\",
    \"issuer\": \"https://token.actions.githubusercontent.com\",
    \"subject\": \"repo:${REPO_OWNER}/${REPO_NAME}:pull_request\",
    \"audiences\": [\"api://AzureADTokenExchange\"]
  }"
echo "✅ Pull request OIDC configured"
echo ""

# Assign Contributor role
echo "🎫 Assigning Contributor role..."
az role assignment create \
  --assignee "$APP_ID" \
  --role Contributor \
  --scope "/subscriptions/$SUBSCRIPTION_ID"
echo "✅ Contributor role assigned"
echo ""

# Assign User Access Administrator role (needed for RBAC assignments in Bicep)
echo "🎫 Assigning User Access Administrator role..."
az role assignment create \
  --assignee "$APP_ID" \
  --role "User Access Administrator" \
  --scope "/subscriptions/$SUBSCRIPTION_ID"
echo "✅ User Access Administrator role assigned"
echo ""

# Wait for role propagation
echo "⏳ Waiting 30 seconds for role assignments to propagate..."
sleep 30
echo ""

# Display summary
echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "📝 Add these secrets to your GitHub repository:"
echo "   Go to: https://github.com/${REPO_OWNER}/${REPO_NAME}/settings/secrets/actions"
echo ""
echo "Secret Name: AZURE_CLIENT_ID"
echo "Value: $APP_ID"
echo ""
echo "Secret Name: AZURE_TENANT_ID"
echo "Value: $TENANT_ID"
echo ""
echo "Secret Name: AZURE_SUBSCRIPTION_ID"
echo "Value: $SUBSCRIPTION_ID"
echo ""
echo "=========================================="
echo ""
echo "📋 Next steps:"
echo "1. Copy the values above"
echo "2. Go to your GitHub repository settings"
echo "3. Navigate to Secrets and variables > Actions"
echo "4. Click 'New repository secret' for each"
echo "5. Push to main branch or manually trigger the workflow"
echo ""
echo "🔗 Direct link to add secrets:"
echo "   https://github.com/${REPO_OWNER}/${REPO_NAME}/settings/secrets/actions/new"
echo ""
