# Azure Naming Convention

This document describes the naming convention used for Azure resources in the JobFitAI project.

## Naming Pattern

All resources follow Microsoft's recommended naming conventions with the pattern:

```
<resource-abbreviation>-<org>-<workload>-<environment>-<region>
```

### Components

- **resource-abbreviation**: Standard Azure resource type abbreviation (e.g., `rg`, `func`, `st`)
- **org**: Organization or project identifier (default: `jl`)
- **workload**: Application/workload name (default: `jobfitai`)
- **environment**: Deployment environment (`dev`, `staging`, `prod`)
- **region**: Azure region abbreviation (default: `uks` for UK South)

## Resource Naming Examples

### Development Environment (UK South)

| Resource Type | Naming Convention | Example |
|--------------|-------------------|---------|
| Resource Group | `rg-<org>-<workload>-<env>-<region>` | `rg-jl-jobfitai-dev-uks` |
| Storage Account | `st<org><workload><env><region>` | `stjljobfitaidevuks` |
| Function App | `func-<org>-<workload>-<env>-<region>` | `func-jl-jobfitai-dev-uks` |
| App Service Plan | `asp-<org>-<workload>-<env>-<region>` | `asp-jl-jobfitai-dev-uks` |
| Static Web App | `swa-<org>-<workload>-<env>-<region>` | `swa-jl-jobfitai-dev-uks` |
| Key Vault | `kv-<org>-<workload>-<env>-<region>` | `kv-jl-jobfitai-dev-uks` |
| Application Insights | `appi-<org>-<workload>-<env>-<region>` | `appi-jl-jobfitai-dev-uks` |
| Log Analytics | `log-<org>-<workload>-<env>-<region>` | `log-jl-jobfitai-dev-uks` |

### Production Environment (UK South)

| Resource Type | Example |
|--------------|---------|
| Resource Group | `rg-jl-jobfitai-prod-uks` |
| Storage Account | `stjljobfitaiprod uks` |
| Function App | `func-jl-jobfitai-prod-uks` |
| Static Web App | `swa-jl-jobfitai-prod-uks` |

## Region Abbreviations

| Region | Abbreviation | Full Name |
|--------|-------------|-----------|
| UK South | `uks` | UK South |
| UK West | `ukw` | UK West |
| West Europe | `weu` | West Europe |
| North Europe | `neu` | North Europe |

## Storage Account Special Rules

Storage account names have specific restrictions:
- Must be globally unique
- Only lowercase letters and numbers
- 3-24 characters long
- No hyphens allowed

Therefore, storage accounts use: `st<org><workload><env><region>` (no hyphens)

## Resource Tags

All resources are tagged with:

```json
{
  "Environment": "dev|staging|prod",
  "Workload": "jobfitai",
  "ManagedBy": "Bicep",
  "CostCenter": "jl"
}
```

## Configuration

To customize the naming convention, update the parameters in `main.bicepparam`:

```bicep
param location = 'uksouth'        // Azure region
param environment = 'dev'          // Environment name
param workloadName = 'jobfitai'    // Application name
param orgName = 'jl'               // Organization identifier
```

## References

- [Microsoft Cloud Adoption Framework - Naming Convention](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming)
- [Abbreviation examples for Azure resources](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/azure-best-practices/resource-abbreviations)
