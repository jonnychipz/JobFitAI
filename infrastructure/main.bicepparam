using './main.bicep'

param location = 'eastus'
param environment = 'dev'
param resourcePrefix = 'jobfitai'
param azureOpenAIApiKey = readEnvironmentVariable('AZURE_OPENAI_API_KEY', '')
