# Terraform Backend Configuration
# This stores the Terraform state in Azure Storage for team collaboration
# and state locking to prevent concurrent modifications.
# Uses Azure AD authentication (not storage account keys)

terraform {
  backend "azurerm" {
    resource_group_name  = "rg-terraform-state"
    storage_account_name = "sttfstatejobfitai"
    container_name       = "tfstate"
    key                  = "jobfitai.tfstate"
    use_azuread_auth     = true
    # Azure AD authentication will use:
    # - Locally: Azure CLI
    # - GitHub Actions: OIDC via ARM_CLIENT_ID, ARM_TENANT_ID, ARM_SUBSCRIPTION_ID, ARM_OIDC_TOKEN
  }
}
