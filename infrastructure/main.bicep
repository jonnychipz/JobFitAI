// Main Bicep template for JobFitAI infrastructure
targetScope = 'subscription'

@description('The Azure region for all resources')
param location string = 'eastus'

@description('The environment name (dev, staging, prod)')
@allowed(['dev', 'staging', 'prod'])
param environment string = 'dev'

@description('The resource prefix for naming')
param resourcePrefix string = 'jobfitai'

@secure()
@description('The Azure OpenAI API key')
param azureOpenAIApiKey string

// Resource group
resource rg 'Microsoft.Resources/resourceGroups@2023-07-01' = {
  name: '${resourcePrefix}-${environment}-rg'
  location: location
}

// Key Vault module
module keyVault './modules/keyvault.bicep' = {
  scope: rg
  params: {
    location: location
    environment: environment
    keyVaultName: '${resourcePrefix}-${environment}-kv'
    azureOpenAIApiKey: azureOpenAIApiKey
  }
}

// Storage Account module
module storage './modules/storage.bicep' = {
  scope: rg
  params: {
    location: location
    environment: environment
    storageAccountName: replace('${resourcePrefix}${environment}st', '-', '')
  }
}

// Application Insights module
module appInsights './modules/appinsights.bicep' = {
  scope: rg
  params: {
    location: location
    environment: environment
    appInsightsName: '${resourcePrefix}-${environment}-ai'
  }
}

// Azure Functions module
module functionApp './modules/functionapp.bicep' = {
  scope: rg
  params: {
    location: location
    environment: environment
    functionAppName: '${resourcePrefix}-${environment}-func'
    storageAccountName: storage.outputs.storageAccountName
    appInsightsConnectionString: appInsights.outputs.connectionString
    keyVaultName: keyVault.outputs.keyVaultName
  }
}

// Static Web App module
module staticWebApp './modules/staticwebapp.bicep' = {
  scope: rg
  params: {
    location: location
    environment: environment
    staticWebAppName: '${resourcePrefix}-${environment}-swa'
  }
}

// Outputs
output resourceGroupName string = rg.name
output keyVaultName string = keyVault.outputs.keyVaultName
output storageAccountName string = storage.outputs.storageAccountName
output functionAppName string = functionApp.outputs.functionAppName
output staticWebAppName string = staticWebApp.outputs.staticWebAppName
output functionAppUrl string = functionApp.outputs.functionAppUrl
output staticWebAppUrl string = staticWebApp.outputs.staticWebAppUrl
