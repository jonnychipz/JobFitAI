// Static Web App module
@description('The Azure region')
param location string

@description('The environment name')
param environment string

@description('The workload name')
param workloadName string

@description('The organization name')
param orgName string

@description('The Static Web App name')
param staticWebAppName string

// Static Web Apps have limited region availability
// Map common regions to supported SWA regions
var swaRegionMap = {
  uksouth: 'westeurope'
  ukwest: 'westeurope'
  northeurope: 'westeurope'
  westeurope: 'westeurope'
  eastus: 'eastus2'
  eastus2: 'eastus2'
  westus: 'westus2'
  westus2: 'westus2'
  centralus: 'centralus'
  southeastasia: 'eastasia'
  eastasia: 'eastasia'
}

// Use mapped region if available, otherwise default to westeurope
var swaLocation = swaRegionMap[?location] ?? 'westeurope'

resource staticWebApp 'Microsoft.Web/staticSites@2023-01-01' = {
  name: staticWebAppName
  location: swaLocation
  tags: {
    Environment: environment
    Workload: workloadName
    ManagedBy: 'Bicep'
    CostCenter: orgName
  }
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    repositoryUrl: '' // Will be set via GitHub Actions
    branch: 'main'
    buildProperties: {
      appLocation: '/frontend'
      apiLocation: ''
      outputLocation: 'dist'
    }
  }
}

output staticWebAppName string = staticWebApp.name
output staticWebAppId string = staticWebApp.id
output staticWebAppUrl string = 'https://${staticWebApp.properties.defaultHostname}'
// Note: API key should be retrieved separately via Azure CLI or Portal for security
// output staticWebAppApiKey string = staticWebApp.listSecrets().properties.apiKey
