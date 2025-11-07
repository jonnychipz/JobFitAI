# JobFitAI - Architecture Overview

## 📐 System Architecture

JobFitAI is a production-ready, cloud-native CV analysis and optimization platform built on Azure. The system follows a modern serverless architecture with clear separation of concerns.

```
┌─────────────────────────────────────────────────────────────────┐
│                         USERS                                    │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Azure Front Door (Optional)                   │
│                   SSL/TLS, CDN, WAF                             │
└───────────────────────────┬─────────────────────────────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
        ▼                                       ▼
┌──────────────────┐                   ┌──────────────────┐
│  Static Web App  │                   │ Azure Functions  │
│   (Frontend)     │◄──────REST───────►│   (Backend)      │
│                  │       API         │                  │
│  - React 18      │                   │  - Node.js 20    │
│  - TypeScript    │                   │  - TypeScript    │
│  - Vite          │                   │  - v4 Model      │
│  - TailwindCSS   │                   │                  │
│  - React Query   │                   │  Endpoints:      │
│  - MSAL Auth     │                   │  - Upload CV     │
│                  │                   │  - Parse CV      │
└──────────────────┘                   │  - Optimize CV   │
                                       │  - Match Job     │
                                       │  - Insights      │
                                       └────────┬─────────┘
                                                │
                    ┌───────────────────────────┼───────────────────────┐
                    │                           │                       │
                    ▼                           ▼                       ▼
         ┌──────────────────┐      ┌──────────────────┐    ┌──────────────────┐
         │  Azure OpenAI    │      │  Blob Storage    │    │   Key Vault      │
         │                  │      │                  │    │                  │
         │  - GPT-4 Model   │      │  - CV Files      │    │  - API Keys      │
         │  - Text Analysis │      │  - Documents     │    │  - Secrets       │
         │  - Optimization  │      │  - Container     │    │  - Certificates  │
         └──────────────────┘      └──────────────────┘    └──────────────────┘
                                                │
                                                ▼
                                   ┌──────────────────────┐
                                   │ Application Insights │
                                   │                      │
                                   │  - Monitoring        │
                                   │  - Logging           │
                                   │  - Telemetry         │
                                   │  - Alerts            │
                                   └──────────────────────┘
```

## 🏗️ Component Architecture

### Frontend Layer (React SPA)

**Technology Stack:**
- React 18 with TypeScript
- Vite for blazing-fast builds
- TailwindCSS for styling
- React Query for state management
- MSAL for Azure AD authentication

**Key Components:**
```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ThemeToggle.tsx  # Dark mode toggle
│   │   ├── Navbar.tsx       # Navigation
│   │   ├── CVUpload.tsx     # File upload with drag-and-drop
│   │   └── Layout.tsx       # App layout wrapper
│   ├── pages/              # Route-based page components
│   │   ├── HomePage.tsx    # Landing page
│   │   ├── UploadPage.tsx  # CV upload interface
│   │   ├── Dashboard.tsx   # CV analysis dashboard
│   │   └── JobMatch.tsx    # Job matching interface
│   ├── services/           # API integration
│   │   └── api/
│   │       ├── client.ts   # Axios HTTP client
│   │       └── cvService.ts # CV API methods
│   ├── hooks/              # Custom React hooks
│   │   ├── useTheme.ts     # Theme management
│   │   └── useCV.ts        # CV operations
│   ├── store/              # State management
│   │   └── themeStore.ts   # Zustand store
│   ├── types/              # TypeScript definitions
│   │   └── index.ts        # Shared types
│   └── config/             # Configuration
│       ├── index.ts        # Environment config
│       └── authConfig.ts   # MSAL configuration
```

**Features Implemented:**
- ✅ Responsive design (mobile-first)
- ✅ Dark mode support
- ✅ Drag-and-drop file upload
- ✅ Type-safe API calls
- ✅ Authentication ready (MSAL)
- ✅ Error handling and loading states

### Backend Layer (Azure Functions)

**Technology Stack:**
- Azure Functions v4
- Node.js 20 (LTS)
- TypeScript
- Azure SDKs for OpenAI, Storage, Key Vault

**API Endpoints:**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/cv/upload` | POST | Upload CV file (PDF/DOCX) |
| `/api/cv/upload-text` | POST | Upload CV text |
| `/api/cv` | GET | Get all user CVs |
| `/api/cv/{cvId}` | GET | Get specific CV |
| `/api/cv/{cvId}/parse` | POST | Parse CV with AI |
| `/api/cv/{cvId}/optimize` | POST | Optimize CV for ATS |
| `/api/cv/{cvId}/match` | POST | Match CV with job |
| `/api/cv/{cvId}/insights` | GET | Get career insights |
| `/api/cv/{cvId}` | DELETE | Delete CV |

**Function Structure:**
```
backend/
├── src/
│   ├── app.ts                    # Main app entry point
│   ├── functions/                # HTTP trigger handlers
│   │   ├── healthCheck.ts
│   │   ├── uploadCV.ts
│   │   ├── parseCV.ts
│   │   ├── optimizeCV.ts
│   │   ├── matchJob.ts
│   │   ├── getCareerInsights.ts
│   │   ├── getCV.ts
│   │   ├── getUserCVs.ts
│   │   └── deleteCV.ts
│   ├── services/                 # Business logic
│   │   ├── openaiService.ts     # Azure OpenAI integration
│   │   ├── storageService.ts    # Blob storage operations
│   │   └── parserService.ts     # PDF/DOCX parsing
│   ├── types/                    # TypeScript types
│   │   └── index.ts
│   └── config/                   # Configuration
│       └── index.ts
├── host.json                     # Functions host config
├── local.settings.json          # Local development settings
└── package.json
```

**Security Features:**
- ✅ Managed Identity authentication
- ✅ Key Vault integration
- ✅ CORS configuration
- ✅ HTTPS only
- ✅ Input validation
- ✅ Function-level authorization

### AI/ML Layer (Azure OpenAI)

**Azure OpenAI Service Integration:**

The system uses GPT-4 for intelligent CV analysis through four main operations:

1. **CV Parsing** (`parseCV`)
   - Extracts structured data from unstructured CV text
   - Identifies personal info, skills, experience, education
   - Categorizes skills by type (technical, soft, language)
   - Returns JSON-formatted data

2. **CV Optimization** (`optimizeCV`)
   - Analyzes ATS compatibility (0-100 score)
   - Provides specific improvement suggestions
   - Identifies missing keywords
   - Generates optimized CV version
   - Highlights improvement areas

3. **Job Matching** (`matchJob`)
   - Compares CV against job description
   - Calculates match score (0-100)
   - Lists matched and missing skills
   - Creates tailored CV for specific job
   - Provides recommendations

4. **Career Insights** (`getCareerInsights`)
   - Analyzes skill demand trends
   - Estimates salary ranges
   - Suggests career paths
   - Provides market insights
   - Recommends skill development

**Prompt Engineering:**
- System prompts define expert personas
- Structured JSON output format
- Clear instructions for consistency
- Context-aware analysis
- Actionable recommendations

### Infrastructure Layer (Azure Resources)

**Resource Topology:**

```yaml
Resource Group: jobfitai-{env}-rg
├── Static Web App
│   ├── Name: jobfitai-{env}-swa
│   ├── SKU: Free
│   └── Purpose: Host React frontend
│
├── Function App
│   ├── Name: jobfitai-{env}-func
│   ├── Runtime: Node 20, Linux
│   ├── Plan: Consumption (Y1)
│   └── Identity: System-assigned Managed Identity
│
├── App Service Plan
│   ├── Name: jobfitai-{env}-func-plan
│   ├── SKU: Dynamic (Y1)
│   └── OS: Linux
│
├── Storage Account
│   ├── Name: jobfitai{env}st
│   ├── SKU: Standard_LRS
│   ├── Containers:
│   │   └── cvfiles (private)
│   └── Purpose: CV file storage, Functions storage
│
├── Key Vault
│   ├── Name: jobfitai-{env}-kv
│   ├── SKU: Standard
│   ├── RBAC: Enabled
│   ├── Secrets:
│   │   └── AzureOpenAIApiKey
│   └── Purpose: Secure secret management
│
├── Application Insights
│   ├── Name: jobfitai-{env}-ai
│   ├── Type: Web
│   └── Purpose: Monitoring, logging, telemetry
│
└── Log Analytics Workspace
    ├── Name: jobfitai-{env}-ai-law
    ├── SKU: PerGB2018
    └── Retention: 30 days
```

**External Dependencies:**
- Azure OpenAI Service (separate resource)
- Azure AD (for authentication)

## 🔐 Security Architecture

### Authentication & Authorization

**Frontend:**
- MSAL.js 2.0 for Azure AD authentication
- Session-based token storage
- Automatic token refresh
- Protected routes

**Backend:**
- Function-level authorization
- Token validation
- Managed Identity for Azure services
- No credentials in code

### Secrets Management

**Key Vault Strategy:**
```
Azure Key Vault
├── AzureOpenAIApiKey       # OpenAI API key
├── StorageAccountKey       # Storage access key (backup)
└── [Future secrets]        # Database connection strings, etc.
```

**Access Pattern:**
1. Function App uses Managed Identity
2. Identity granted Key Vault Secrets User role
3. Secrets retrieved at runtime
4. Never exposed in logs or responses

### Network Security

- **HTTPS Enforced**: All endpoints TLS 1.2+
- **CORS Configuration**: Controlled origins
- **Private Endpoints**: Available for production
- **WAF**: Can be added via Front Door

## 📊 Data Flow

### CV Upload and Analysis Flow

```
1. User uploads CV (PDF/DOCX/Text)
   │
   ▼
2. Frontend validates file
   │
   ▼
3. POST /api/cv/upload
   │
   ▼
4. Function App receives file
   │
   ├─► Parse PDF/DOCX → Extract text
   ├─► Generate unique ID (UUID)
   ├─► Store file in Blob Storage
   └─► Save metadata (database/storage)
   │
   ▼
5. Return CV ID to frontend
   │
   ▼
6. Frontend initiates parsing
   │
   ▼
7. POST /api/cv/{cvId}/parse
   │
   ▼
8. Function retrieves CV text
   │
   ▼
9. Call Azure OpenAI
   │
   ├─► System prompt: "You are a CV parser..."
   ├─► User prompt: CV text
   └─► Response: Structured JSON
   │
   ▼
10. Parse and validate response
    │
    ▼
11. Store parsed data
    │
    ▼
12. Return to frontend
    │
    ▼
13. Display in dashboard
```

## 🚀 Deployment Architecture

### CI/CD Pipeline (GitHub Actions)

**Workflow: deploy.yml**

```yaml
Trigger: Push to main branch

Jobs:
  1. Infrastructure Deployment
     - Login to Azure
     - Deploy Bicep templates
     - Output resource names
  
  2. Backend Deployment (depends on #1)
     - Checkout code
     - Setup Node.js 20
     - Install dependencies
     - Build TypeScript
     - Deploy to Function App
  
  3. Frontend Deployment (depends on #1)
     - Checkout code
     - Setup Node.js 20
     - Install dependencies
     - Build with environment variables
     - Deploy to Static Web App
```

**Workflow: ci.yml**

```yaml
Trigger: Pull requests, push to develop

Jobs:
  1. Frontend Tests
     - Lint code
     - Type check
     - Run unit tests
  
  2. Backend Tests
     - Build TypeScript
     - Run unit tests
```

### Environment Strategy

| Environment | Branch | Auto-Deploy | Purpose |
|-------------|--------|-------------|---------|
| Development | develop | ❌ | Local testing |
| Staging | staging | ✅ | Pre-production |
| Production | main | ✅ | Live system |

## 📈 Monitoring & Observability

### Application Insights Integration

**Telemetry Collected:**
- Request/response times
- Dependency calls (OpenAI, Storage)
- Exceptions and errors
- Custom events
- User analytics
- Performance metrics

**Key Metrics:**
- CV processing time
- OpenAI API latency
- Success/failure rates
- Active users
- API call volume

**Alerts (Recommended):**
- Function failures > 5% in 5 minutes
- Response time > 3 seconds
- OpenAI API errors
- Storage failures

## 🔧 Configuration Management

### Environment Variables

**Frontend (.env.local):**
```env
VITE_API_BASE_URL=https://jobfitai-dev-func.azurewebsites.net/api
VITE_AZURE_CLIENT_ID=xxx
VITE_AZURE_TENANT_ID=xxx
VITE_AZURE_REDIRECT_URI=http://localhost:5173
VITE_ENABLE_AUTH=false
```

**Backend (local.settings.json):**
```json
{
  "Values": {
    "AZURE_OPENAI_ENDPOINT": "https://xxx.openai.azure.com/",
    "AZURE_OPENAI_DEPLOYMENT": "gpt-4",
    "AZURE_STORAGE_CONNECTION_STRING": "xxx",
    "AZURE_KEYVAULT_URL": "https://xxx.vault.azure.net/",
    "APPLICATIONINSIGHTS_CONNECTION_STRING": "xxx"
  }
}
```

## 📦 Build and Bundle Strategy

### Frontend Build

**Vite Configuration:**
- Code splitting by vendor (React, MSAL)
- Tree shaking for smaller bundles
- Minification and compression
- Source maps for debugging
- Asset optimization

**Bundle Sizes (Target):**
- Main bundle: < 200 KB
- Vendor chunks: < 500 KB
- Total initial load: < 1 MB

### Backend Build

**TypeScript Compilation:**
- Target: ES2020
- Module: CommonJS
- Source maps enabled
- Declaration files generated

## 🧪 Testing Strategy

### Frontend Tests
- **Unit Tests**: Jest + React Testing Library
- **Component Tests**: Render and interaction tests
- **Hook Tests**: Custom hooks testing
- **Integration Tests**: API service tests

### Backend Tests
- **Unit Tests**: Jest
- **Function Tests**: HTTP trigger testing
- **Service Tests**: OpenAI service mocks
- **Integration Tests**: End-to-end API tests

## 🎯 Future Enhancements

### Phase 2 (Coming Soon)
- [ ] Full dashboard implementation
- [ ] PDF generation for optimized CVs
- [ ] User authentication and profiles
- [ ] CV history and versioning
- [ ] Multiple CV comparisons

### Phase 3 (Planned)
- [ ] Job board integration
- [ ] Real-time collaboration
- [ ] AI interview preparation
- [ ] Skills gap analysis
- [ ] Career roadmap visualization

## 📝 Summary

This architecture provides:
- ✅ **Scalability**: Serverless auto-scaling
- ✅ **Security**: Managed Identity, Key Vault, HTTPS
- ✅ **Performance**: CDN, caching, optimized bundles
- ✅ **Reliability**: Health checks, monitoring, retries
- ✅ **Maintainability**: TypeScript, modular code, IaC
- ✅ **Cost-Effective**: Consumption-based pricing
- ✅ **DevOps Ready**: CI/CD, automated deployments
- ✅ **Production-Ready**: Monitoring, logging, alerts

---

**Total Cost (Estimated Monthly):**
- Development: ~$10-20 (excluding OpenAI usage)
- Production: ~$50-100 (with moderate traffic)

**Deployment Time:**
- Initial setup: ~30 minutes
- Subsequent deployments: ~5 minutes
