# Deployment Checklist

## ✅ Infrastructure Ready

All Bicep templates are configured and validated:

- ✅ `main.bicep` - Main orchestration template with all modules
- ✅ `main.bicepparam` - Parameters file (location, environment, workloadName, orgName)
- ✅ `modules/openai.bicep` - Azure OpenAI with GPT-4 deployment
- ✅ `modules/keyvault.bicep` - Key Vault with OpenAI credentials
- ✅ `modules/storage.bicep` - Storage Account for Functions
- ✅ `modules/functionapp.bicep` - Azure Functions backend with managed identity
- ✅ `modules/staticwebapp.bicep` - Static Web App for frontend
- ✅ `modules/appinsights.bicep` - Application Insights monitoring

## ✅ GitHub Actions Workflow Ready

Workflow file: `.github/workflows/deploy.yml`

Features:

- ✅ OIDC authentication (no stored credentials)
- ✅ Bicep validation on all pushes
- ✅ What-if preview on pull requests
- ✅ Full deployment on main branch pushes
- ✅ Backend build and deploy
- ✅ Frontend build and deploy
- ✅ Post-deployment health checks

## 📋 Setup Required (Follow GITHUB-SETUP.md)

### 1. Azure Service Principal with OIDC

Run these commands:

```bash
# Set your variables
export SUBSCRIPTION_ID=$(az account show --query id -o tsv)
export APP_NAME="github-jobfitai-deployer"
export REPO_OWNER="your-github-username"  # ← CHANGE THIS
export REPO_NAME="JobFitAI"

# Create service principal
az ad app create --display-name $APP_NAME
export APP_ID=$(az ad app list --display-name $APP_NAME --query "[0].appId" -o tsv)
az ad sp create --id $APP_ID

# Configure OIDC for main branch
az ad app federated-credential create \
  --id $APP_ID \
  --parameters '{
    "name": "github-jobfitai-main",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:'$REPO_OWNER'/'$REPO_NAME':ref:refs/heads/main",
    "audiences": ["api://AzureADTokenExchange"]
  }'

# Configure OIDC for pull requests
az ad app federated-credential create \
  --id $APP_ID \
  --parameters '{
    "name": "github-jobfitai-pr",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:'$REPO_OWNER'/'$REPO_NAME':pull_request",
    "audiences": ["api://AzureADTokenExchange"]
  }'

# Assign permissions
az role assignment create \
  --assignee $APP_ID \
  --role Contributor \
  --scope "/subscriptions/$SUBSCRIPTION_ID"

az role assignment create \
  --assignee $APP_ID \
  --role "User Access Administrator" \
  --scope "/subscriptions/$SUBSCRIPTION_ID"

# Get values for GitHub secrets
echo "=== ADD THESE TO GITHUB SECRETS ==="
echo "AZURE_CLIENT_ID: $APP_ID"
echo "AZURE_TENANT_ID: $(az account show --query tenantId -o tsv)"
echo "AZURE_SUBSCRIPTION_ID: $SUBSCRIPTION_ID"
```

### 2. Configure GitHub Secrets

Go to: **Your Repo** → Settings → Secrets and variables → Actions

Add these 3 secrets:

| Secret Name             | Description              |
| ----------------------- | ------------------------ |
| `AZURE_CLIENT_ID`       | Service Principal App ID |
| `AZURE_TENANT_ID`       | Azure AD Tenant ID       |
| `AZURE_SUBSCRIPTION_ID` | Azure Subscription ID    |

### 3. Deploy

**Option A: Push to main branch**

```bash
git add .
git commit -m "Configure Azure deployment"
git push origin main
```

**Option B: Manual trigger**

1. Go to GitHub → Actions tab
2. Select "Deploy JobFitAI to Azure" workflow
3. Click "Run workflow"

## 🎯 Expected Results

### Pull Request

- Validates Bicep syntax
- Shows what resources will be created/changed
- Does NOT deploy

### Main Branch Push

1. ✅ Validates Bicep files
2. ✅ Deploys Azure infrastructure
3. ✅ Builds backend (TypeScript → JavaScript)
4. ✅ Deploys backend to Azure Functions
5. ✅ Builds frontend (React + Vite)
6. ✅ Deploys frontend to Static Web App
7. ✅ Tests health endpoints
8. ✅ Shows deployment summary

### Deployed URLs

After deployment completes:

- Frontend: `https://swa-jl-jobfitai-dev-uks-<random>.azurestaticapps.net`
- Backend: `https://func-jl-jobfitai-dev-uks-<random>.azurewebsites.net`
- Resource Group: `rg-jl-jobfitai-dev-uks`

## 📖 Documentation

- **GITHUB-SETUP.md** - Detailed setup instructions
- **DEPLOYMENT.md** - Infrastructure architecture
- **QUICKSTART.md** - Local development guide
- **ARCHITECTURE.md** - System design overview

## 🔧 Troubleshooting

### "Insufficient privileges" error

Wait 5-10 minutes for Azure AD role propagation

### "Resource provider not registered" error

```bash
az provider register --namespace Microsoft.Web
az provider register --namespace Microsoft.Storage
az provider register --namespace Microsoft.KeyVault
az provider register --namespace Microsoft.CognitiveServices
az provider register --namespace Microsoft.Insights
```

### Bicep validation fails locally

```bash
# Test what-if deployment
az deployment sub what-if \
  --location uksouth \
  --template-file ./infrastructure/main.bicep \
  --parameters ./infrastructure/main.bicepparam
```

## 🚀 Post-Deployment

1. ✅ Verify deployment in Azure Portal
2. ✅ Check Application Insights for logs
3. ✅ Test frontend URL
4. ✅ Test backend health endpoint: `/api/health`
5. ✅ Upload a test CV to verify end-to-end flow

## 🔒 Security Features

- **OIDC Auth**: No credentials stored in GitHub
- **Managed Identity**: Function App accesses Key Vault without secrets
- **Key Vault**: Azure OpenAI keys stored securely
- **RBAC**: Least privilege access control
- **HTTPS Only**: All endpoints enforce TLS
- **No Data Retention**: Privacy-first design (as declared in UI)

---

**Status**: ✅ All files ready for deployment
**Next Step**: Configure GitHub secrets and push to main branch
