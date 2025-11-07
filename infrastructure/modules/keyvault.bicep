// Key Vault module
@description('The Azure region')
param location string

@description('The environment name')
param environment string

@description('The workload name')
param workloadName string

@description('The organization name')
param orgName string

@description('The Key Vault name')
param keyVaultName string

@description('The Azure OpenAI endpoint URL')
param openAIEndpoint string

@description('The Azure OpenAI account name for getting the key')
param openAIAccountName string

// Get reference to existing Azure OpenAI account
resource openAIAccount 'Microsoft.CognitiveServices/accounts@2023-05-01' existing = {
  name: openAIAccountName
}

resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: keyVaultName
  location: location
  tags: {
    Environment: environment
    Workload: workloadName
    ManagedBy: 'Bicep'
    CostCenter: orgName
  }
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: subscription().tenantId
    enableRbacAuthorization: true
    enableSoftDelete: true
    softDeleteRetentionInDays: 90
    enabledForDeployment: true
    enabledForTemplateDeployment: true
    publicNetworkAccess: 'Enabled'
    networkAcls: {
      defaultAction: 'Allow'
      bypass: 'AzureServices'
    }
  }
}

// Store Azure OpenAI API Key
resource openAISecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'AzureOpenAIApiKey'
  properties: {
    value: openAIAccount.listKeys().key1
  }
}

// Store Azure OpenAI Endpoint
resource openAIEndpointSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'AzureOpenAIEndpoint'
  properties: {
    value: openAIEndpoint
  }
}

output keyVaultName string = keyVault.name
output keyVaultId string = keyVault.id
output keyVaultUri string = keyVault.properties.vaultUri
