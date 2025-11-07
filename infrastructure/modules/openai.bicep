// Azure OpenAI Cognitive Services module
@description('The Azure region')
param location string

@description('The environment name')
param environment string

@description('The workload name')
param workloadName string

@description('The organization name')
param orgName string

@description('The Azure OpenAI account name')
param openAIAccountName string

@description('The deployment model name')
param deploymentModelName string = 'gpt-4o'

@description('The deployment model version - using 2024-05-13 (GPT-4o)')
param modelVersion string = '2024-05-13'

@description('The deployment capacity')
param deploymentCapacity int = 10

// Azure OpenAI Cognitive Services Account
resource openAIAccount 'Microsoft.CognitiveServices/accounts@2023-05-01' = {
  name: openAIAccountName
  location: location
  tags: {
    Environment: environment
    Workload: workloadName
    ManagedBy: 'Bicep'
    CostCenter: orgName
  }
  kind: 'OpenAI'
  sku: {
    name: 'S0'
  }
  properties: {
    customSubDomainName: openAIAccountName
    publicNetworkAccess: 'Enabled'
    networkAcls: {
      defaultAction: 'Allow'
    }
  }
}

// GPT-4o Deployment
resource gpt4Deployment 'Microsoft.CognitiveServices/accounts/deployments@2023-05-01' = {
  parent: openAIAccount
  name: deploymentModelName
  sku: {
    name: 'GlobalStandard'
    capacity: deploymentCapacity
  }
  properties: {
    model: {
      format: 'OpenAI'
      name: deploymentModelName
      version: modelVersion
    }
    versionUpgradeOption: 'OnceNewDefaultVersionAvailable'
    raiPolicyName: 'Microsoft.Default'
  }
}

output openAIAccountName string = openAIAccount.name
output openAIAccountId string = openAIAccount.id
output openAIEndpoint string = openAIAccount.properties.endpoint
output deploymentName string = gpt4Deployment.name
