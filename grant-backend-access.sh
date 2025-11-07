#!/bin/bash
# Grant GitHub Actions Service Principal access to Terraform state backend

set -e

echo "🔐 Granting Service Principal Access to Terraform State"
echo "========================================================"
echo ""

# Check if AZURE_CLIENT_ID is provided
if [ -z "$1" ]; then
    echo "❌ Error: AZURE_CLIENT_ID not provided"
    echo ""
    echo "Usage: ./grant-backend-access.sh <AZURE_CLIENT_ID>"
    echo ""
    echo "Get your AZURE_CLIENT_ID from:"
    echo "  GitHub → Settings → Secrets and variables → Actions → AZURE_CLIENT_ID"
    echo ""
    exit 1
fi

AZURE_CLIENT_ID="$1"
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
STORAGE_ACCOUNT="sttfstatejobfitai"
RESOURCE_GROUP="rg-terraform-state"

echo "Configuration:"
echo "  Service Principal: $AZURE_CLIENT_ID"
echo "  Subscription:      $SUBSCRIPTION_ID"
echo "  Storage Account:   $STORAGE_ACCOUNT"
echo ""

# Grant Storage Blob Data Owner role
echo "🔑 Granting Storage Blob Data Owner role..."
az role assignment create \
    --role "Storage Blob Data Owner" \
    --assignee "$AZURE_CLIENT_ID" \
    --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Storage/storageAccounts/$STORAGE_ACCOUNT" \
    --output table

echo ""
echo "✅ Service Principal granted access to Terraform state backend!"
echo ""
echo "The GitHub Actions workflows can now use the remote backend."
echo ""
