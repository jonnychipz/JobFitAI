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
    # Azure AD authentication works for both local (Azure CLI) and GitHub Actions (OIDC)
    use_azuread_auth = true
  }
}
