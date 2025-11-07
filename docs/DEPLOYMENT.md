# Deployment Guide for JobFitAI CV Explorer

This guide will walk you through deploying the JobFitAI application to Azure.

## Prerequisites

1. **Azure Account**: Active Azure subscription
2. **Azure CLI**: [Install Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli)
3. **Azure OpenAI Access**: Provision Azure OpenAI resource
4. **GitHub Account**: For CI/CD with GitHub Actions
5. **Node.js 20+**: For local development

## Step 1: Provision Azure OpenAI

```bash
# Create Azure OpenAI resource
az cognitiveservices account create \
  --name jobfitai-openai \
  --resource-group jobfitai-dev-rg \
  --kind OpenAI \
  --sku S0 \
  --location eastus

# Deploy GPT-4 model
az cognitiveservices account deployment create \
  --name jobfitai-openai \
  --resource-group jobfitai-dev-rg \
  --deployment-name gpt-4 \
  --model-name gpt-4 \
  --model-version "0613" \
  --model-format OpenAI \
  --scale-settings-scale-type "Standard"

# Get the API key
az cognitiveservices account keys list \
  --name jobfitai-openai \
  --resource-group jobfitai-dev-rg
```

## Step 2: Deploy Infrastructure with Bicep

```bash
# Login to Azure
az login

# Set subscription
az account set --subscription "YOUR_SUBSCRIPTION_ID"

# Create deployment
az deployment sub create \
  --location eastus \
  --template-file infrastructure/main.bicep \
  --parameters infrastructure/main.bicepparam \
  --parameters azureOpenAIApiKey="YOUR_OPENAI_API_KEY"
```

## Step 3: Configure GitHub Secrets

Add the following secrets to your GitHub repository (Settings > Secrets and variables > Actions):

### Required Secrets:

1. **AZURE_CREDENTIALS**: Service Principal credentials
   ```bash
   az ad sp create-for-rbac \
     --name jobfitai-deploy-sp \
     --role contributor \
     --scopes /subscriptions/{subscription-id}/resourceGroups/jobfitai-dev-rg \
     --sdk-auth
   ```
   Copy the entire JSON output to this secret.

2. **AZURE_OPENAI_API_KEY**: Your Azure OpenAI API key

3. **AZURE_CLIENT_ID**: Azure AD App Registration Client ID

4. **AZURE_TENANT_ID**: Your Azure AD Tenant ID

5. **AZURE_STATIC_WEB_APPS_API_TOKEN**: 
   ```bash
   az staticwebapp secrets list \
     --name jobfitai-dev-swa \
     --resource-group jobfitai-dev-rg \
     --query properties.apiKey -o tsv
   ```

## Step 4: Configure Azure AD Authentication (Optional)

1. **Create App Registration**:
   ```bash
   az ad app create \
     --display-name "JobFitAI CV Explorer" \
     --sign-in-audience AzureADMyOrg \
     --web-redirect-uris "https://your-static-web-app.azurestaticapps.net"
   ```

2. **Configure API Permissions**:
   - Microsoft Graph > User.Read (Delegated)

3. **Update environment variables** with Client ID and Tenant ID

## Step 5: Deploy via GitHub Actions

1. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```

2. **Monitor deployment**:
   - Go to GitHub Actions tab
   - Watch the deployment workflow

## Step 6: Verify Deployment

1. **Check Azure Resources**:
   ```bash
   az resource list \
     --resource-group jobfitai-dev-rg \
     --output table
   ```

2. **Test Function App**:
   ```bash
   curl https://jobfitai-dev-func.azurewebsites.net/api/health
   ```

3. **Access Frontend**:
   Visit the Static Web App URL from Azure Portal

## Step 7: Configure Custom Domain (Optional)

1. **Add custom domain to Static Web App**:
   ```bash
   az staticwebapp hostname set \
     --name jobfitai-dev-swa \
     --resource-group jobfitai-dev-rg \
     --hostname www.yourdomain.com
   ```

2. **Update DNS records** as instructed by Azure

## Local Development

### Backend (Azure Functions)

```bash
cd backend
npm install
npm run build

# Create local.settings.json with your Azure OpenAI credentials
npm start
```

### Frontend (React SPA)

```bash
cd frontend
npm install

# Create .env.local with your configuration
npm run dev
```

## Monitoring and Troubleshooting

### View Logs

**Function App Logs**:
```bash
az functionapp log tail \
  --name jobfitai-dev-func \
  --resource-group jobfitai-dev-rg
```

**Application Insights**:
```bash
az monitor app-insights query \
  --app jobfitai-dev-ai \
  --resource-group jobfitai-dev-rg \
  --analytics-query "requests | take 10"
```

### Common Issues

1. **Function App not starting**:
   - Check Application Settings in Azure Portal
   - Verify Node.js version (should be 20)
   - Check logs for errors

2. **CORS errors**:
   - Verify CORS settings in Function App
   - Check allowed origins

3. **OpenAI API errors**:
   - Verify API key in Key Vault
   - Check deployment name matches configuration
   - Ensure quota is not exceeded

## Costs

Estimated monthly costs for development environment:
- Azure Functions (Consumption): ~$0-5
- Static Web Apps (Free tier): $0
- Storage Account: ~$1-2
- Application Insights: ~$2-5
- Key Vault: ~$0.03
- Azure OpenAI: Pay-per-use (varies)

**Total**: ~$10-20/month (excluding OpenAI usage)

## Security Best Practices

1. **Enable Managed Identity** for Function App
2. **Use Key Vault** for all secrets
3. **Enable HTTPS only**
4. **Configure network restrictions** in production
5. **Regular security reviews** of code and configuration
6. **Monitor for unusual activity** in Application Insights

## Cleanup

To delete all resources:

```bash
az group delete \
  --name jobfitai-dev-rg \
  --yes --no-wait
```

## Support

For issues or questions:
- Check Application Insights logs
- Review Function App logs
- Open GitHub issue
- Contact Azure Support for infrastructure issues
