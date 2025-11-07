variable "location" {
  description = "The Azure region for all resources"
  type        = string
  default     = "westeurope"
}

variable "environment" {
  description = "The environment name (dev, staging, prod)"
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "workload_name" {
  description = "The workload/application name for naming"
  type        = string
  default     = "jobfitai"
}

variable "org_name" {
  description = "The organization or project identifier"
  type        = string
  default     = "jl"
}

variable "openai_model_name" {
  description = "The OpenAI model deployment name"
  type        = string
  default     = "gpt-4o"
}

variable "openai_model_version" {
  description = "The OpenAI model version"
  type        = string
  default     = "2024-05-13"
}

variable "openai_deployment_capacity" {
  description = "The deployment capacity for OpenAI"
  type        = number
  default     = 10
}

# Local variables for naming convention
locals {
  naming_prefix = "${var.org_name}-${var.workload_name}-${var.environment}"
  location_short = {
    "westeurope"  = "weu"
    "eastus"      = "eus"
    "westus2"     = "wus2"
    "northeurope" = "neu"
    "uksouth"     = "uks"
  }
  location_abbr = lookup(local.location_short, var.location, "weu")

  # Resource names following Azure naming conventions
  resource_group_name   = "rg-${local.naming_prefix}-${local.location_abbr}"
  storage_account_name  = "st${replace(local.naming_prefix, "-", "")}${local.location_abbr}"
  key_vault_name        = "kv-${local.naming_prefix}-${local.location_abbr}"
  app_insights_name     = "appi-${local.naming_prefix}-${local.location_abbr}"
  log_analytics_name    = "log-${local.naming_prefix}-${local.location_abbr}"
  function_app_name     = "func-${local.naming_prefix}-${local.location_abbr}"
  app_service_plan_name = "asp-${local.naming_prefix}-${local.location_abbr}"
  static_web_app_name   = "swa-${local.naming_prefix}-${local.location_abbr}"
  openai_account_name   = "oai-${local.naming_prefix}-${local.location_abbr}"

  # Static Web App region mapping (SWA only available in specific regions)
  swa_region_map = {
    "westeurope"  = "westeurope"
    "uksouth"     = "westeurope"
    "northeurope" = "westeurope"
    "eastus"      = "eastus2"
    "eastus2"     = "eastus2"
    "westus"      = "westus2"
    "westus2"     = "westus2"
    "centralus"   = "centralus"
    "eastasia"    = "eastasia"
  }
  swa_location = lookup(local.swa_region_map, var.location, "westeurope")

  # Common tags
  common_tags = {
    Environment = var.environment
    Workload    = var.workload_name
    ManagedBy   = "Terraform"
    CostCenter  = var.org_name
  }
}
