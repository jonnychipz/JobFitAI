# Resource Group
# Resource Group
resource "azurerm_resource_group" "main" {
  name     = local.resource_group_name
  location = var.location
  tags     = local.common_tags
}

# Storage Account
# Storage Account for Function App and CV files
# Note: Service principal has Storage Blob Data Owner role at subscription level
# Note: Shared key access is disabled by Azure Policy - using Azure AD authentication
resource "azurerm_storage_account" "main" {
  name                     = local.storage_account_name
  resource_group_name      = azurerm_resource_group.main.name
  location                 = azurerm_resource_group.main.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  account_kind             = "StorageV2"
  access_tier              = "Hot"
  min_tls_version          = "TLS1_2"

  https_traffic_only_enabled      = true
  allow_nested_items_to_be_public = false
  # shared_access_key_enabled is enforced as false by Azure Policy
  # Using Azure AD authentication instead

  network_rules {
    default_action = "Allow"
    bypass         = ["AzureServices"]
  }

  # Prevent Terraform from trying to read data plane properties during creation
  lifecycle {
    ignore_changes = [
      blob_properties,
      queue_properties,
      share_properties
    ]
  }

  tags = local.common_tags
}

# Blob Service
resource "azurerm_storage_container" "cvfiles" {
  name                  = "cvfiles"
  storage_account_name  = azurerm_storage_account.main.name
  container_access_type = "private"
}

# File Share for Function App
resource "azurerm_storage_share" "function_content" {
  name                 = "function-content"
  storage_account_name = azurerm_storage_account.main.name
  quota                = 5120
  
  # This resource is managed by Terraform but accessed via Azure AD by the Function App
  # Azure Policy prevents shared key access, so we rely on RBAC permissions
  depends_on = [
    azurerm_storage_account.main
  ]
}

# Log Analytics Workspace
resource "azurerm_log_analytics_workspace" "main" {
  name                = local.log_analytics_name
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = "PerGB2018"
  retention_in_days   = 30

  tags = local.common_tags
}

# Application Insights
resource "azurerm_application_insights" "main" {
  name                = local.app_insights_name
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  workspace_id        = azurerm_log_analytics_workspace.main.id
  application_type    = "web"

  tags = local.common_tags
}

# Azure OpenAI Cognitive Services Account
resource "azurerm_cognitive_account" "openai" {
  name                = local.openai_account_name
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  kind                = "OpenAI"
  sku_name            = "S0"

  tags = local.common_tags
}

# Azure OpenAI Deployment
resource "azurerm_cognitive_deployment" "gpt4o" {
  name                 = var.openai_model_name
  cognitive_account_id = azurerm_cognitive_account.openai.id

  model {
    format  = "OpenAI"
    name    = var.openai_model_name
    version = var.openai_model_version
  }

  scale {
    type     = "GlobalStandard"
    capacity = var.openai_deployment_capacity
  }
}

# Key Vault
resource "azurerm_key_vault" "main" {
  name                       = local.key_vault_name
  resource_group_name        = azurerm_resource_group.main.name
  location                   = azurerm_resource_group.main.location
  tenant_id                  = data.azurerm_client_config.current.tenant_id
  sku_name                   = "standard"
  soft_delete_retention_days = 90 # Immutable once set - matches existing
  purge_protection_enabled   = false

  enable_rbac_authorization = true

  network_acls {
    default_action = "Allow"
    bypass         = "AzureServices"
  }

  tags = local.common_tags
}

# Store OpenAI API Key in Key Vault
resource "azurerm_key_vault_secret" "openai_api_key" {
  name         = "AzureOpenAIApiKey"
  value        = azurerm_cognitive_account.openai.primary_access_key
  key_vault_id = azurerm_key_vault.main.id

  depends_on = [
    azurerm_role_assignment.keyvault_admin
  ]
}

# Import existing secret if it already exists
import {
  to = azurerm_key_vault_secret.openai_api_key
  id = "https://kv-jl-jobfitai-dev-weu.vault.azure.net/secrets/AzureOpenAIApiKey/c8d2e0533a72402287508c55eeba3953"
}

# App Service Plan for Functions (Consumption)
resource "azurerm_service_plan" "main" {
  name                = local.app_service_plan_name
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  os_type             = "Linux"
  sku_name            = "Y1"

  tags = local.common_tags
}

# Function App
resource "azurerm_linux_function_app" "main" {
  name                         = local.function_app_name
  resource_group_name          = azurerm_resource_group.main.name
  location                     = azurerm_resource_group.main.location
  service_plan_id              = azurerm_service_plan.main.id
  storage_account_name         = azurerm_storage_account.main.name
  storage_uses_managed_identity = true # Using managed identity instead of access key
  https_only                   = true

  identity {
    type = "SystemAssigned"
  }

  site_config {
    application_stack {
      node_version = "20"
    }

    cors {
      allowed_origins = ["*"]
    }

    minimum_tls_version = "1.2"
    ftps_state          = "Disabled"
  }

  app_settings = {
    "FUNCTIONS_EXTENSION_VERSION"           = "~4"
    "FUNCTIONS_WORKER_RUNTIME"              = "node"
    "WEBSITE_NODE_DEFAULT_VERSION"          = "~20"
    "WEBSITE_CONTENTSHARE"                  = azurerm_storage_share.function_content.name
    "APPLICATIONINSIGHTS_CONNECTION_STRING" = azurerm_application_insights.main.connection_string
    "AZURE_KEYVAULT_URL"                    = azurerm_key_vault.main.vault_uri
    # Using managed identity for storage access instead of connection string
    "AZURE_STORAGE_ACCOUNT_NAME"            = azurerm_storage_account.main.name
    "AZURE_OPENAI_ENDPOINT"                 = azurerm_cognitive_account.openai.endpoint
    "AZURE_OPENAI_DEPLOYMENT_NAME"          = azurerm_cognitive_deployment.gpt4o.name
    "AZURE_OPENAI_API_KEY"                  = "@Microsoft.KeyVault(VaultName=${azurerm_key_vault.main.name};SecretName=AzureOpenAIApiKey)"
  }

  tags = local.common_tags
}

# Static Web App
resource "azurerm_static_web_app" "main" {
  name                = local.static_web_app_name
  resource_group_name = azurerm_resource_group.main.name
  location            = local.swa_location
  sku_tier            = "Free"
  sku_size            = "Free"

  tags = local.common_tags
}

# Data source for current Azure client config
data "azurerm_client_config" "current" {}

# Role Assignment: Key Vault Administrator (for Terraform to manage secrets)
resource "azurerm_role_assignment" "keyvault_admin" {
  scope                = azurerm_key_vault.main.id
  role_definition_name = "Key Vault Administrator"
  principal_id         = data.azurerm_client_config.current.object_id
}

# Role Assignment: Function App access to Key Vault Secrets
resource "azurerm_role_assignment" "function_keyvault_secrets_user" {
  scope                = azurerm_key_vault.main.id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = azurerm_linux_function_app.main.identity[0].principal_id
}

# Role Assignment: Function App access to Storage Account (replaces storage key access)
resource "azurerm_role_assignment" "function_storage_blob_contributor" {
  scope                = azurerm_storage_account.main.id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = azurerm_linux_function_app.main.identity[0].principal_id
}
