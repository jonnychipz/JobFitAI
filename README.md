# JobFitAI - AI-Powered CV Analysis Platform

An intelligent CV analysis and optimization platform built with React, TypeScript, Azure Functions, and Azure OpenAI (GPT-4).

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)
[![Azure](https://img.shields.io/badge/Azure-Cloud-blue)](https://azure.microsoft.com/)

## 🚀 Current Features

### ✅ Implemented

- **CV Upload**: Drag & drop PDF/DOCX files or paste CV text directly
- **Privacy-First Design**: No data retention policy with clear privacy notice
- **CV Analysis UI**: Complete analysis results page featuring:
  - ATS score visualization with color-coded indicators (0-100)
  - Career insights (experience level, industry fit)
  - Critical improvements list
  - Keyword suggestions for better ATS performance
  - Skill gap analysis
  - Actionable next steps recommendations
- **Dark Mode**: Seamless light/dark theme toggle
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Modern UI**: Clean, professional interface with Lucide React icons
- **Azure Infrastructure**: Production-ready Bicep templates for automated deployment

### 🔨 In Development

- Backend API implementation
- AI-powered CV parsing with Azure OpenAI GPT-4
- Real-time CV analysis
- Job matching functionality
- User authentication (Azure AD/MSAL)
- CV history and versioning
- PDF export for optimized CVs

## 🏗️ Architecture

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite (lightning-fast HMR)
- **Styling**: TailwindCSS 3.4
- **State Management**: Zustand
- **Routing**: React Router v6
- **File Upload**: react-dropzone
- **HTTP Client**: Axios

### Backend Stack
- **Runtime**: Azure Functions v4 (Node.js 20)
- **Language**: TypeScript
- **AI Service**: Azure OpenAI (GPT-4)
- **Storage**: Azure Blob Storage
- **Secrets**: Azure Key Vault with managed identity
- **Monitoring**: Application Insights + Log Analytics

### Infrastructure
- **Frontend**: Azure Static Web Apps
- **Backend**: Azure Functions (serverless)
- **AI**: Azure OpenAI with GPT-4 deployment
- **Security**: Azure Key Vault for secrets
- **Monitoring**: Application Insights
- **IaC**: Bicep templates (modular design)
- **CI/CD**: GitHub Actions with OIDC authentication

## 📋 Prerequisites

- **Node.js 20.x** or later
- **Azure subscription**
- **Azure CLI** installed
- **Git**
- **GitHub account** (for automated deployment)
- **Azure OpenAI access** (optional for local dev - app runs in test mode without it)

## 🛠️ Quick Start

### Local Development

**Detailed setup guide:** [docs/QUICKSTART.md](./docs/QUICKSTART.md)

```bash
# 1. Clone repository
git clone https://github.com/jonnychipz/JobFitAI.git
cd JobFitAI

# 2. Install dependencies
npm run install:all

# 3. Start development servers
npm run dev
```

Access the app:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:7071

### Azure Deployment

**Complete deployment guide:** [docs/DEPLOYMENT-SUMMARY.md](./docs/DEPLOYMENT-SUMMARY.md)

**Quick deploy (15 minutes):**

1. **Configure Azure Service Principal with OIDC** - [Instructions](./docs/GITHUB-SETUP.md)
2. **Add 3 GitHub secrets**: `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`
3. **Push to main branch** - Automated deployment via GitHub Actions

```bash
git push origin main
# Watch deployment in GitHub Actions tab
```

## 📁 Project Structure

```
JobFitAI/
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Layout.tsx      # App layout wrapper
│   │   │   ├── Navbar.tsx      # Navigation with dark mode
│   │   │   ├── CVUpload.tsx    # File upload component
│   │   │   └── PrivacyNotice.tsx # Privacy compliance
│   │   ├── pages/              # Route-based pages
│   │   │   ├── HomePage.tsx    # Landing page
│   │   │   ├── UploadPage.tsx  # CV upload interface
│   │   │   └── CVAnalysisPage.tsx # Analysis results
│   │   ├── services/           # API integration
│   │   ├── hooks/              # Custom React hooks
│   │   ├── store/              # State management
│   │   └── types/              # TypeScript definitions
│   └── public/                 # Static assets
├── backend/                     # Azure Functions
│   ├── src/
│   │   ├── functions/          # HTTP trigger handlers
│   │   │   ├── healthCheck.ts
│   │   │   ├── uploadCV.ts
│   │   │   ├── parseCV.ts
│   │   │   └── ...
│   │   ├── services/           # Business logic
│   │   │   └── openaiService.ts # Azure OpenAI integration
│   │   ├── types/              # TypeScript types
│   │   └── config/             # Configuration
│   └── host.json               # Functions configuration
├── infrastructure/              # Infrastructure as Code
│   ├── main.bicep              # Main orchestration
│   ├── main.bicepparam         # Parameters
│   └── modules/                # Reusable modules
│       ├── openai.bicep        # Azure OpenAI
│       ├── functionapp.bicep   # Backend functions
│       ├── staticwebapp.bicep  # Frontend hosting
│       ├── keyvault.bicep      # Secrets management
│       └── ...
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD pipeline
└── docs/                        # Documentation
    ├── DEPLOYMENT-SUMMARY.md   # Complete deployment guide
    ├── GITHUB-SETUP.md         # GitHub Actions setup
    ├── QUICKSTART.md           # Local dev guide
    └── ARCHITECTURE.md         # System architecture
```

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [DEPLOYMENT-SUMMARY.md](./docs/DEPLOYMENT-SUMMARY.md) | **Start here!** Complete deployment overview |
| [GITHUB-SETUP.md](./docs/GITHUB-SETUP.md) | GitHub Actions + Azure OIDC setup |
| [DEPLOYMENT-CHECKLIST.md](./docs/DEPLOYMENT-CHECKLIST.md) | Quick reference checklist |
| [QUICKSTART.md](./docs/QUICKSTART.md) | Local development setup |
| [ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System design and architecture |

## 🔒 Security

- ✅ **OIDC Authentication**: No long-lived credentials in GitHub
- ✅ **Managed Identities**: Function App accesses Key Vault securely
- ✅ **Key Vault Integration**: All secrets stored securely
- ✅ **RBAC**: Least-privilege access control
- ✅ **HTTPS Only**: All endpoints enforce TLS
- ✅ **No Data Retention**: Privacy-first architecture
- ✅ **Input Validation**: Secure file upload and processing

## 🧪 Testing

```bash
# Run all tests
npm test

# Frontend tests
cd frontend && npm test

# Backend tests
cd backend && npm test

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📊 Monitoring

The application includes comprehensive monitoring:

- **Application Insights**: Request tracking, performance metrics
- **Log Analytics**: Centralized logging
- **Custom Metrics**: AI operation tracking
- **Health Checks**: Automated endpoint monitoring
- **Error Tracking**: Exception monitoring and alerts

Access logs after deployment:
```bash
az monitor app-insights query \
  --app appi-jl-jobfitai-dev-uks \
  --analytics-query "requests | take 10"
```

## 💰 Cost Estimate

**Development Environment:**
- Azure Functions (Consumption): ~$0-5/month
- Static Web App (Free): $0
- Storage Account: ~$1-2/month
- Key Vault: ~$0.50/month
- Application Insights: ~$2-5/month
- Azure OpenAI: Pay-per-use (~$10-50/month depending on usage)

**Total:** ~$15-65/month

**Production:** Scale based on traffic, typically $50-200/month

## 🚀 Deployment Status

The project includes a complete CI/CD pipeline:

### GitHub Actions Workflow

- ✅ **Pull Requests**: Bicep validation + what-if preview
- ✅ **Main Branch**: Full deployment (infrastructure + application)
- ✅ **Manual Trigger**: On-demand deployments

### Deployment Steps

1. Validate Bicep templates
2. Deploy Azure infrastructure
3. Build & deploy backend
4. Build & deploy frontend
5. Run post-deployment tests
6. Generate deployment summary

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [Open a GitHub issue](https://github.com/jonnychipz/JobFitAI/issues)
- **Documentation**: Check the [docs](./docs/) folder
- **Azure Support**: For infrastructure issues, contact Azure Support

## 🎯 Roadmap

### Next Milestones

**Phase 1 (Current)**
- ✅ Frontend UI complete
- ✅ Infrastructure templates ready
- ✅ CI/CD pipeline configured
- 🔨 Backend API implementation

**Phase 2**
- AI-powered CV parsing
- Job matching functionality
- User authentication (MSAL)
- CV history and storage
- PDF export

**Phase 3**
- Analytics dashboard
- Job board integration
- Skills trend analysis
- Interview preparation
- Career roadmap visualization

## 👥 Authors

- **Jon Chipchase** - *Initial work* - [jonnychipz](https://github.com/jonnychipz)

## 🙏 Acknowledgments

- Azure OpenAI for GPT-4 integration
- React community for excellent tooling
- Azure Functions team for serverless platform
- TailwindCSS for beautiful styling
- All contributors and testers

---

**Built with ❤️ using Azure, React, and TypeScript**

**Ready to deploy?** Check out [docs/DEPLOYMENT-SUMMARY.md](./docs/DEPLOYMENT-SUMMARY.md)
