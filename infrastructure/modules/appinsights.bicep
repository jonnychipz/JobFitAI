// Application Insights module
@description('The Azure region')
param location string

@description('The environment name')
param environment string

@description('The workload name')
param workloadName string

@description('The organization name')
param orgName string

@description('The Application Insights name')
param appInsightsName string

@description('The Log Analytics Workspace name')
param logAnalyticsName string

// Log Analytics Workspace
resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: logAnalyticsName
  location: location
  tags: {
    Environment: environment
    Workload: workloadName
    ManagedBy: 'Bicep'
    CostCenter: orgName
  }
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
  }
}

// Application Insights
resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsName
  location: location
  kind: 'web'
  tags: {
    Environment: environment
    Workload: workloadName
    ManagedBy: 'Bicep'
    CostCenter: orgName
  }
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalyticsWorkspace.id
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
}

output appInsightsName string = appInsights.name
output appInsightsId string = appInsights.id
output instrumentationKey string = appInsights.properties.InstrumentationKey
output connectionString string = appInsights.properties.ConnectionString
