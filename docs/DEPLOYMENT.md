# Deployment Guide for JobFitAI

This guide provides an overview of deploying JobFitAI to Azure. For detailed step-by-step instructions, see the comprehensive guides below.

## 📚 Documentation Links

- **[DEPLOYMENT-SUMMARY.md](./DEPLOYMENT-SUMMARY.md)** - **START HERE!** Complete overview with architecture, costs, and quick setup
- **[GITHUB-SETUP.md](./GITHUB-SETUP.md)** - Detailed GitHub Actions and Azure OIDC setup instructions
- **[DEPLOYMENT-CHECKLIST.md](./DEPLOYMENT-CHECKLIST.md)** - Quick reference checklist for deployment steps
- **[QUICKSTART.md](./QUICKSTART.md)** - Local development setup guide
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and design decisions

## Quick Overview

JobFitAI uses a serverless architecture on Azure with automated deployment via GitHub Actions.

### Architecture

```
┌─────────────────────────────────────────────────┐
│              GitHub Actions                      │
│         (OIDC Authentication)                    │
└───────────────┬─────────────────────────────────┘
                │ Deploys
                ↓
┌─────────────────────────────────────────────────┐
│           Azure Resources                        │
│  Resource Group: rg-jl-jobfitai-dev-uks         │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌──────────────────┐    ┌──────────────────┐  │
│  │ Static Web App   │    │  Azure Functions │  │
│  │   (Frontend)     │◄───┤    (Backend)     │  │
│  │  React + Vite    │    │  Node.js + TS    │  │
│  └──────────────────┘    └────────┬─────────┘  │
│           │                        │             │
│           ↓                        ↓             │
│  ┌──────────────────┐    ┌──────────────────┐  │
│  │  Azure OpenAI    │    │   Key Vault      │  │
│  │   (GPT-4 API)    │◄───┤  (Credentials)   │  │
│  └──────────────────┘    └──────────────────┘  │
│           │                        │             │
│           ↓                        ↓             │
│  ┌─────────────────────────────────────────┐   │
│  │     Application Insights + Logs         │   │
│  │         (Monitoring & Analytics)        │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

## Prerequisites

1. **Azure Account**: Active Azure subscription
2. **Azure CLI**: [Install Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli)
3. **GitHub Account**: Repository with admin access
4. **Node.js 20+**: For local development

## Deployment Methods

### ✅ Recommended: GitHub Actions (Automated)

**Pros:**
- Fully automated deployment pipeline
- OIDC authentication (no stored credentials)
- Infrastructure and application deployed together
- Built-in validation and testing
- Easy rollbacks

**Setup Time:** ~15 minutes

**Steps:**
1. Configure Azure Service Principal with OIDC
2. Add 3 GitHub secrets
3. Push to main branch
4. Monitor deployment in GitHub Actions

**Full Instructions:** [GITHUB-SETUP.md](./GITHUB-SETUP.md)

### Alternative: Manual Deployment

**When to use:**
- Initial testing
- Troubleshooting deployments
- Learning the infrastructure

**Steps:**

#### 1. Deploy Infrastructure

```bash
# Login and set subscription
az login
az account set --subscription "YOUR_SUBSCRIPTION_ID"

# Deploy Bicep templates
az deployment sub create \
  --name "jobfitai-$(date +%Y%m%d-%H%M%S)" \
  --location uksouth \
  --template-file infrastructure/main.bicep \
  --parameters infrastructure/main.bicepparam
```

#### 2. Deploy Backend

```bash
cd backend
npm install
npm run build
func azure functionapp publish <function-app-name>
```

#### 3. Deploy Frontend

```bash
cd frontend
npm install
VITE_API_URL=https://<function-app>.azurewebsites.net npm run build

# Deploy using SWA CLI
npx @azure/static-web-apps-cli deploy \
  --app-location frontend/dist \
  --deployment-token <your-token>
```

## Infrastructure Components

### Resources Created

| Resource | Type | Purpose |
|----------|------|---------|
| Resource Group | `rg-jl-jobfitai-dev-uks` | Container for all resources |
| Function App | `func-jl-jobfitai-dev-uks-*` | Backend API (Node.js 20) |
| Static Web App | `swa-jl-jobfitai-dev-uks-*` | Frontend hosting (React) |
| Storage Account | `stjljobfitaidevuks*` | CV file storage |
| Key Vault | `kv-jl-jobfitai-dev-uks` | Secrets management |
| Azure OpenAI | `oai-jl-jobfitai-dev-uks` | GPT-4 AI service |
| Application Insights | `appi-jl-jobfitai-dev-uks` | Monitoring & logs |
| Log Analytics | `log-jl-jobfitai-dev-uks` | Log aggregation |

### Security Features

- ✅ **OIDC Authentication**: No credentials in GitHub
- ✅ **Managed Identities**: Function App accesses Key Vault securely
- ✅ **Key Vault**: Azure OpenAI keys stored securely
- ✅ **RBAC**: Least-privilege access control
- ✅ **HTTPS Only**: All endpoints enforce TLS

## Configuration

### GitHub Secrets Required

For automated deployment, configure these secrets in GitHub:

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `AZURE_CLIENT_ID` | Service Principal App ID | See [GITHUB-SETUP.md](./GITHUB-SETUP.md) |
| `AZURE_TENANT_ID` | Azure AD Tenant ID | `az account show --query tenantId -o tsv` |
| `AZURE_SUBSCRIPTION_ID` | Azure Subscription ID | `az account show --query id -o tsv` |

### Environment Variables

**Backend (Auto-configured):**
- `AZURE_OPENAI_ENDPOINT` - Retrieved from Key Vault
- `AZURE_OPENAI_DEPLOYMENT_NAME` - Set to "gpt-4"
- `AZURE_OPENAI_API_KEY` - Key Vault reference
- `APPLICATIONINSIGHTS_CONNECTION_STRING` - Auto-configured

**Frontend (Set during build):**
- `VITE_API_URL` - Function App URL

## Deployment Workflow

### GitHub Actions Pipeline

```
1. Validate Bicep ──► Check syntax and what-if preview
                      (Runs on all PRs)
                      
2. Deploy Infrastructure ──► Create/update Azure resources
                            (Main branch only)
                            
3. Build & Deploy Backend ──► Compile TypeScript
                              Deploy to Function App
                              
4. Build & Deploy Frontend ──► Build React app
                               Deploy to Static Web App
                               
5. Post-Deployment Tests ──► Health checks
                             Deployment summary
```

### Trigger Events

- **Pull Request**: Validation only (safe preview)
- **Push to main**: Full deployment
- **Manual**: Workflow dispatch

## Verification

### After Deployment

1. **Check Azure Resources:**
   ```bash
   az resource list \
     --resource-group rg-jl-jobfitai-dev-uks \
     --output table
   ```

2. **Test Backend API:**
   ```bash
   curl https://func-jl-jobfitai-dev-uks-*.azurewebsites.net/api/health
   ```

3. **Access Frontend:**
   Visit the Static Web App URL from deployment output

4. **Check Logs:**
   ```bash
   az monitor app-insights query \
     --app appi-jl-jobfitai-dev-uks \
     --analytics-query "requests | take 10"
   ```

## Cost Estimate

**Development Environment:**
- Azure Functions (Consumption): ~$0-5/month
- Static Web App (Free): $0
- Storage Account: ~$1-2/month
- Key Vault: ~$0.50/month
- Application Insights: ~$2-5/month
- Azure OpenAI: Pay-per-use (~$10-50/month depending on usage)

**Total:** ~$15-65/month

## Troubleshooting

### Common Issues

**1. "Insufficient privileges" error**
- Wait 5-10 minutes for Azure AD role propagation
- Verify service principal has both Contributor and User Access Administrator roles

**2. "Resource provider not registered"**
```bash
az provider register --namespace Microsoft.Web
az provider register --namespace Microsoft.Storage
az provider register --namespace Microsoft.KeyVault
az provider register --namespace Microsoft.CognitiveServices
az provider register --namespace Microsoft.Insights
```

**3. Bicep validation fails**
```bash
az bicep build --file infrastructure/main.bicep
```

**4. Function App health check fails**
- Check Application Insights for errors
- Verify Key Vault access for managed identity
- Check environment variables in Azure Portal

### Getting Help

1. Check [GITHUB-SETUP.md](./GITHUB-SETUP.md) for detailed instructions
2. Review Application Insights logs
3. Check GitHub Actions workflow logs
4. Review [ARCHITECTURE.md](./ARCHITECTURE.md) for system design

## Local Development

For local development setup, see [QUICKSTART.md](./QUICKSTART.md).

## Cleanup

To delete all Azure resources:

```bash
az group delete \
  --name rg-jl-jobfitai-dev-uks \
  --yes --no-wait
```

## Next Steps

1. ✅ Follow [DEPLOYMENT-SUMMARY.md](./DEPLOYMENT-SUMMARY.md) for complete setup
2. ✅ Configure GitHub secrets using [GITHUB-SETUP.md](./GITHUB-SETUP.md)
3. ✅ Push to main branch to trigger deployment
4. ✅ Monitor deployment in GitHub Actions
5. ✅ Verify deployed application
6. ✅ Set up custom domain (optional)
7. ✅ Configure Azure Monitor alerts (optional)

## Support

- **Documentation Issues**: Open GitHub issue
- **Azure Issues**: Check Application Insights, contact Azure Support
- **Deployment Help**: Review [GITHUB-SETUP.md](./GITHUB-SETUP.md) and [DEPLOYMENT-CHECKLIST.md](./DEPLOYMENT-CHECKLIST.md)

---

**Ready to deploy?** Start with [DEPLOYMENT-SUMMARY.md](./DEPLOYMENT-SUMMARY.md)!
