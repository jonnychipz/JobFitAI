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

### Remote State Backend

**Terraform state is stored in Azure Storage for team collaboration and state locking.**

Backend configuration:

- **Resource Group**: `rg-terraform-state`
- **Storage Account**: `sttfstatejobfitai`
- **Container**: `tfstate`
- **State File**: `jobfitai.tfstate`
- **Authentication**: Azure AD (no storage keys required)

The remote backend is already configured in `backend.tf` and will be used automatically.

### Variables

Edit `terraform.tfvars` to customize:

- `location`: Azure region (default: westeurope)
- `environment`: Environment name (dev/staging/prod)
- `workload_name`: Application name
- `org_name`: Organization identifier

### GitHub Actions Setup

**Grant Service Principal access to the remote backend:**

After setting up your GitHub secrets (AZURE_CLIENT_ID, AZURE_TENANT_ID, AZURE_SUBSCRIPTION_ID), run:

```bash
./grant-backend-access.sh <AZURE_CLIENT_ID>
```

This grants your GitHub Actions service principal permission to read/write Terraform state.

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
