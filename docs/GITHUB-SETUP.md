# GitHub Actions Deployment Setup

This guide explains how to configure GitHub Actions to deploy JobFitAI to Azure using OpenID Connect (OIDC) authentication.

## Overview

The deployment workflow (`.github/workflows/deploy.yml`) automates:

- ✅ Bicep template validation
- ✅ Infrastructure deployment (Azure Functions, Static Web App, Storage, Key Vault, OpenAI)
- ✅ Backend build and deployment
- ✅ Frontend build and deployment
- ✅ Post-deployment health checks

## Prerequisites

1. Azure subscription
2. Azure CLI installed locally (for setup)
3. GitHub repository with admin access

## Step 1: Create Azure Service Principal with OIDC

### 1.1 Set Variables

```bash
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
RESOURCE_GROUP="rg-jl-jobfitai-dev-weu"
APP_NAME="github-jobfitai-deployer"
REPO_OWNER="your-github-username"  # Replace with your GitHub username/org
REPO_NAME="JobFitAI"               # Replace with your repo name
```

### 1.2 Create Service Principal

```bash
az ad app create --display-name $APP_NAME
APP_ID=$(az ad app list --display-name $APP_NAME --query "[0].appId" -o tsv)

az ad sp create --id $APP_ID
OBJECT_ID=$(az ad sp show --id $APP_ID --query id -o tsv)
```

### 1.3 Configure OIDC Federated Credentials

For main branch deployments:

```bash
az ad app federated-credential create \
  --id $APP_ID \
  --parameters '{
    "name": "github-jobfitai-main",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:'$REPO_OWNER'/'$REPO_NAME':ref:refs/heads/main",
    "audiences": ["api://AzureADTokenExchange"]
  }'
```

For pull request validations:

```bash
az ad app federated-credential create \
  --id $APP_ID \
  --parameters '{
    "name": "github-jobfitai-pr",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:'$REPO_OWNER'/'$REPO_NAME':pull_request",
    "audiences": ["api://AzureADTokenExchange"]
  }'
```

### 1.4 Assign Azure Permissions

Grant Contributor role at subscription level:

```bash
az role assignment create \
  --assignee $APP_ID \
  --role Contributor \
  --scope "/subscriptions/$SUBSCRIPTION_ID"
```

Grant User Access Administrator role (needed for RBAC assignments):

```bash
az role assignment create \
  --assignee $APP_ID \
  --role "User Access Administrator" \
  --scope "/subscriptions/$SUBSCRIPTION_ID"
```

## Step 2: Configure GitHub Secrets

### 2.1 Get Required Values

```bash
echo "AZURE_CLIENT_ID: $APP_ID"
echo "AZURE_TENANT_ID: $(az account show --query tenantId -o tsv)"
echo "AZURE_SUBSCRIPTION_ID: $SUBSCRIPTION_ID"
```

### 2.2 Add Secrets to GitHub

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add:

| Secret Name             | Value             | Description                      |
| ----------------------- | ----------------- | -------------------------------- |
| `AZURE_CLIENT_ID`       | Output from above | Service Principal Application ID |
| `AZURE_TENANT_ID`       | Output from above | Azure AD Tenant ID               |
| `AZURE_SUBSCRIPTION_ID` | Output from above | Azure Subscription ID            |

## Step 3: Verify Configuration

### 3.1 Test Locally (Optional)

Test Bicep deployment locally:

```bash
az deployment sub create \
  --name "jobfitai-test-$(date +%Y%m%d-%H%M%S)" \
  --location westeurope \
  --template-file ./infrastructure/main.bicep \
  --parameters ./infrastructure/main.bicepparam \
  --what-if
```

### 3.2 Trigger Workflow

- **Push to main branch**: Full deployment
- **Open pull request**: Validation and what-if preview only

You can also manually trigger from GitHub:

1. Go to **Actions** tab
2. Select **Deploy JobFitAI to Azure** workflow
3. Click **Run workflow**

## Workflow Behavior

### Pull Requests

- ✅ Validates Bicep syntax
- ✅ Shows what-if deployment preview
- ❌ Does not deploy (safe for code review)

### Main Branch Push

- ✅ Validates Bicep syntax
- ✅ Deploys infrastructure
- ✅ Builds and deploys backend (Azure Functions)
- ✅ Builds and deploys frontend (Static Web App)
- ✅ Runs health checks
- ✅ Displays deployment summary

## Resource Outputs

After successful deployment, the workflow provides:

```
🚀 Deployment Successful

Deployed Resources:
- Frontend: https://<generated-url>.azurestaticapps.net
- Backend API: https://func-jl-jobfitai-dev-uks-<random>.azurewebsites.net
- Resource Group: rg-jl-jobfitai-dev-weu
```

## Troubleshooting

### Error: "Insufficient privileges to complete the operation"

- Ensure service principal has both **Contributor** and **User Access Administrator** roles
- Wait 5-10 minutes for Azure AD role propagation

### Error: "The subscription is not registered to use namespace"

- Register required resource providers:
  ```bash
  az provider register --namespace Microsoft.Web
  az provider register --namespace Microsoft.Storage
  az provider register --namespace Microsoft.KeyVault
  az provider register --namespace Microsoft.CognitiveServices
  az provider register --namespace Microsoft.Insights
  az provider register --namespace Microsoft.OperationalInsights
  ```

### Error: "Resource provider quota exceeded"

- Check your Azure subscription quotas
- Request quota increase if needed

### Bicep Deployment Failed

- Check Azure Portal for detailed error messages
- Review Application Insights for Function App logs
- Verify all parameters in `main.bicepparam`

## Security Best Practices

✅ **Using OIDC (OpenID Connect)** - No long-lived credentials stored in GitHub  
✅ **Federated identity credentials** - GitHub workflow identity verified by Azure AD  
✅ **Key Vault secrets** - Azure OpenAI keys stored securely, not in GitHub  
✅ **Managed identities** - Function App uses managed identity to access Key Vault  
✅ **Least privilege** - Service principal has minimum required permissions

## Architecture

```
GitHub Actions Workflow
    ↓ (OIDC Auth)
Azure Service Principal
    ↓ (Deploys)
Bicep Templates
    ↓ (Creates)
┌─────────────────────────────────────┐
│ Azure Resources                     │
├─────────────────────────────────────┤
│ - Resource Group                    │
│ - Azure OpenAI (GPT-4)             │
│ - Key Vault (stores OpenAI key)    │
│ - Storage Account                   │
│ - Function App (backend)           │
│ - Static Web App (frontend)        │
│ - Application Insights             │
│ - Log Analytics Workspace          │
└─────────────────────────────────────┘
```

## Next Steps

1. ✅ Configure GitHub secrets (AZURE_CLIENT_ID, AZURE_TENANT_ID, AZURE_SUBSCRIPTION_ID)
2. ✅ Push code to main branch or create pull request
3. ✅ Monitor workflow execution in GitHub Actions tab
4. ✅ Access deployed application from Static Web App URL
5. ✅ Configure custom domain (optional)
6. ✅ Set up Azure Monitor alerts (optional)

## Support

For deployment issues:

- Check GitHub Actions workflow logs
- Review Azure Portal deployment history
- Inspect Application Insights for runtime errors
- Consult `docs/DEPLOYMENT.md` for infrastructure details
