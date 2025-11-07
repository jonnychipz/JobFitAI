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
param deploymentModelName string = 'gpt-4'

@description('The deployment model version')
param modelVersion string = '0613'

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

// GPT-4 Deployment
resource gpt4Deployment 'Microsoft.CognitiveServices/accounts/deployments@2023-05-01' = {
  parent: openAIAccount
  name: deploymentModelName
  sku: {
    name: 'Standard'
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
