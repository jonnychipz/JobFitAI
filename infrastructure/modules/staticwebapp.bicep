// Static Web App module
@description('The Azure region')
param location string

@description('The environment name')
param environment string

@description('The Static Web App name')
param staticWebAppName string

resource staticWebApp 'Microsoft.Web/staticSites@2023-01-01' = {
  name: staticWebAppName
  location: location
  tags: {
    environment: environment
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
