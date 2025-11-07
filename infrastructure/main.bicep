// Main Bicep template for JobFitAI infrastructure
targetScope = 'subscription'

@description('The Azure region for all resources')
param location string = 'uksouth'

@description('The environment name (dev, staging, prod)')
@allowed(['dev', 'staging', 'prod'])
param environment string = 'dev'

@description('The workload/application name for naming')
param workloadName string = 'jobfitai'

@description('The organization or project identifier')
param orgName string = 'jl'

// Azure naming convention: rg-<workload>-<environment>-<region>
var namingPrefix = '${orgName}-${workloadName}-${environment}'
var locationShort = 'uks' // UK South abbreviation

// Resource group
resource rg 'Microsoft.Resources/resourceGroups@2023-07-01' = {
  name: 'rg-${namingPrefix}-${locationShort}'
  location: location
  tags: {
    Environment: environment
    Workload: workloadName
    ManagedBy: 'Bicep'
    CostCenter: orgName
  }
}

// Azure OpenAI module - oai-<workload>-<environment>-<region>
module openAI './modules/openai.bicep' = {
  scope: rg
  params: {
    location: location
    environment: environment
    workloadName: workloadName
    orgName: orgName
    openAIAccountName: 'oai-${namingPrefix}-${locationShort}'
    deploymentModelName: 'gpt-4'
    modelVersion: '0613'
    deploymentCapacity: 10
  }
}

// Key Vault module - kv-<workload>-<environment>-<region>
module keyVault './modules/keyvault.bicep' = {
  scope: rg
  params: {
    location: location
    environment: environment
    workloadName: workloadName
    orgName: orgName
    keyVaultName: 'kv-${namingPrefix}-${locationShort}'
    openAIEndpoint: openAI.outputs.openAIEndpoint
    openAIAccountName: openAI.outputs.openAIAccountName
  }
}

// Storage Account module - st<workload><environment><region>
module storage './modules/storage.bicep' = {
  scope: rg
  params: {
    location: location
    environment: environment
    workloadName: workloadName
    orgName: orgName
    storageAccountName: 'st${replace(namingPrefix, '-', '')}${locationShort}'
  }
}

// Application Insights module - appi-<workload>-<environment>-<region>
module appInsights './modules/appinsights.bicep' = {
  scope: rg
  params: {
    location: location
    environment: environment
    workloadName: workloadName
    orgName: orgName
    appInsightsName: 'appi-${namingPrefix}-${locationShort}'
    logAnalyticsName: 'log-${namingPrefix}-${locationShort}'
  }
}

// Azure Functions module - func-<workload>-<environment>-<region>
module functionApp './modules/functionapp.bicep' = {
  scope: rg
  params: {
    location: location
    environment: environment
    workloadName: workloadName
    orgName: orgName
    functionAppName: 'func-${namingPrefix}-${locationShort}'
    appServicePlanName: 'asp-${namingPrefix}-${locationShort}'
    storageAccountName: storage.outputs.storageAccountName
    appInsightsConnectionString: appInsights.outputs.connectionString
    keyVaultName: keyVault.outputs.keyVaultName
    openAIEndpoint: openAI.outputs.openAIEndpoint
    openAIDeploymentName: openAI.outputs.deploymentName
  }
}

// Static Web App module - swa-<workload>-<environment>-<region>
module staticWebApp './modules/staticwebapp.bicep' = {
  scope: rg
  params: {
    location: location
    environment: environment
    workloadName: workloadName
    orgName: orgName
    staticWebAppName: 'swa-${namingPrefix}-${locationShort}'
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
output openAIEndpoint string = openAI.outputs.openAIEndpoint
output openAIDeploymentName string = openAI.outputs.deploymentName
