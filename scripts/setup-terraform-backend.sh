#!/bin/bash
# Setup Terraform Remote State Backend in Azure Storage

set -e

echo "🔧 Setting up Terraform Remote State Backend"
echo "=============================================="
echo ""

# Variables
BACKEND_RG="rg-terraform-state"
BACKEND_LOCATION="westeurope"
BACKEND_STORAGE="sttfstatejobfitai"
BACKEND_CONTAINER="tfstate"
BACKEND_KEY="jobfitai.tfstate"

# Check if logged in to Azure
echo "📋 Checking Azure login..."
if ! az account show &> /dev/null; then
    echo "❌ Not logged in to Azure. Please run 'az login' first."
    exit 1
fi

SUBSCRIPTION_ID=$(az account show --query id -o tsv)
SUBSCRIPTION_NAME=$(az account show --query name -o tsv)
echo "✅ Using subscription: $SUBSCRIPTION_NAME ($SUBSCRIPTION_ID)"
echo ""

# Create resource group for Terraform state
echo "📦 Creating resource group for Terraform state..."
if az group show --name "$BACKEND_RG" &> /dev/null; then
    echo "✅ Resource group $BACKEND_RG already exists"
else
    az group create \
        --name "$BACKEND_RG" \
        --location "$BACKEND_LOCATION" \
        --tags "Purpose=TerraformState" "ManagedBy=Script"
    echo "✅ Created resource group: $BACKEND_RG"
fi
echo ""

# Create storage account
echo "💾 Creating storage account for Terraform state..."
if az storage account show --name "$BACKEND_STORAGE" --resource-group "$BACKEND_RG" &> /dev/null; then
    echo "✅ Storage account $BACKEND_STORAGE already exists"
else
    az storage account create \
        --name "$BACKEND_STORAGE" \
        --resource-group "$BACKEND_RG" \
        --location "$BACKEND_LOCATION" \
        --sku Standard_LRS \
        --kind StorageV2 \
        --min-tls-version TLS1_2 \
        --allow-blob-public-access false \
        --https-only true \
        --tags "Purpose=TerraformState" "ManagedBy=Script"
    echo "✅ Created storage account: $BACKEND_STORAGE"
fi
echo ""

# Get storage account key
echo "🔑 Retrieving storage account key..."
ACCOUNT_KEY=$(az storage account keys list \
    --resource-group "$BACKEND_RG" \
    --account-name "$BACKEND_STORAGE" \
    --query '[0].value' -o tsv)
echo "✅ Retrieved storage account key"
echo ""

# Create blob container
echo "📁 Creating blob container for state files..."
if az storage container show \
    --name "$BACKEND_CONTAINER" \
    --account-name "$BACKEND_STORAGE" \
    --account-key "$ACCOUNT_KEY" &> /dev/null; then
    echo "✅ Container $BACKEND_CONTAINER already exists"
else
    az storage container create \
        --name "$BACKEND_CONTAINER" \
        --account-name "$BACKEND_STORAGE" \
        --account-key "$ACCOUNT_KEY" \
        --public-access off
    echo "✅ Created container: $BACKEND_CONTAINER"
fi
echo ""

# Create backend.tf file
echo "📝 Creating backend.tf configuration..."
cat > infrastructure/backend.tf << BACKEND_EOF
# Terraform Backend Configuration
# This stores the Terraform state in Azure Storage for team collaboration
# and state locking to prevent concurrent modifications.

terraform {
  backend "azurerm" {
    resource_group_name  = "$BACKEND_RG"
    storage_account_name = "$BACKEND_STORAGE"
    container_name       = "$BACKEND_CONTAINER"
    key                  = "$BACKEND_KEY"
  }
}
BACKEND_EOF
echo "✅ Created infrastructure/backend.tf"
echo ""

# Display summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Terraform Remote State Backend Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Backend Configuration:"
echo "  Resource Group:   $BACKEND_RG"
echo "  Storage Account:  $BACKEND_STORAGE"
echo "  Container:        $BACKEND_CONTAINER"
echo "  State File:       $BACKEND_KEY"
echo ""
echo "Next Steps:"
echo "  1. Run: cd infrastructure && terraform init -migrate-state"
echo "  2. Confirm migration when prompted"
echo "  3. Commit backend.tf to git"
echo ""
echo "GitHub Secrets Required (already configured):"
echo "  - AZURE_CLIENT_ID"
echo "  - AZURE_TENANT_ID"
echo "  - AZURE_SUBSCRIPTION_ID"
echo ""
echo "The workflows will automatically use the remote backend!"
echo ""
