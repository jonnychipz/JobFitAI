# Terraform Infrastructure README

This directory contains Terraform configuration for deploying the JobFitAI Azure infrastructure.

## Prerequisites

- [Terraform](https://www.terraform.io/downloads) >= 1.5.0
- [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli)
- Azure subscription with appropriate permissions

## Quick Start

1. **Login to Azure**

   ```bash
   az login
   az account set --subscription <subscription-id>
   ```

2. **Initialize Terraform**

   ```bash
   cd infrastructure
   terraform init
   ```

3. **Review the Plan**

   ```bash
   terraform plan
   ```

4. **Apply the Configuration**
   ```bash
   terraform apply
   ```

## Configuration

### Variables

Edit `terraform.tfvars` to customize:

- `location`: Azure region (default: westeurope)
- `environment`: Environment name (dev/staging/prod)
- `workload_name`: Application name
- `org_name`: Organization identifier

### Remote State (Optional)

For team collaboration, configure remote state in Azure Storage:

1. Create a storage account for Terraform state:

   ```bash
   az group create --name rg-terraform-state --location westeurope
   az storage account create --name sttfstate<unique> --resource-group rg-terraform-state --sku Standard_LRS
   az storage container create --name tfstate --account-name sttfstate<unique>
   ```

2. Create `backend.tf`:

   ```hcl
   terraform {
     backend "azurerm" {
       resource_group_name  = "rg-terraform-state"
       storage_account_name = "sttfstate<unique>"
       container_name       = "tfstate"
       key                  = "jobfitai.tfstate"
     }
   }
   ```

3. Re-initialize:
   ```bash
   terraform init -migrate-state
   ```

## Resources Deployed

- **Resource Group**: Container for all resources
- **Storage Account**: Blob storage for CV files and Function App content
- **Key Vault**: Secure storage for secrets and API keys
- **Azure OpenAI**: GPT-4o model deployment
- **Application Insights**: Application monitoring and telemetry
- **Function App**: Backend API (Node.js 20, Linux)
- **Static Web App**: Frontend hosting (React)

## Outputs

After deployment, Terraform outputs:

- `resource_group_name`: Resource group name
- `function_app_url`: Function App endpoint
- `static_web_app_url`: Static Web App URL
- `openai_endpoint`: Azure OpenAI endpoint

View outputs:

```bash
terraform output
```

## Cleanup

To destroy all resources:

```bash
terraform destroy
```

## Naming Convention

Resources follow Azure naming best practices:

- Resource Group: `rg-<org>-<workload>-<env>-<region>`
- Storage: `st<org><workload><env><region>`
- Key Vault: `kv-<org>-<workload>-<env>-<region>`
- Function App: `func-<org>-<workload>-<env>-<region>`
- Static Web App: `swa-<org>-<workload>-<env>-<region>`
- Azure OpenAI: `oai-<org>-<workload>-<env>-<region>`

## CI/CD

See `.github/workflows/infrastructure-deploy.yml` for automated deployment via GitHub Actions.
