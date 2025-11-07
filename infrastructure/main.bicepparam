using './main.bicep'

param location = 'uksouth'
param environment = 'dev'
param workloadName = 'jobfitai'
param orgName = 'jl'
param azureOpenAIApiKey = readEnvironmentVariable('AZURE_OPENAI_API_KEY', '')
