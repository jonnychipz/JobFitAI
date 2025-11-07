# JobFitAI - CV Explorer

An AI-powered CV analysis and optimization platform built with React, TypeScript, Azure Functions, and Azure OpenAI.

## 🚀 Features

- **CV Upload & Parsing**: Upload PDF/DOCX files or paste CV text
- **AI-Powered Analysis**: Extract skills, experience, and education using Azure OpenAI
- **Smart Optimization**: Get ATS-friendly suggestions and improvements
- **Job Matching**: Generate tailored CV versions for specific job descriptions
- **Career Insights**: Receive market trend analysis based on your skills
- **Comparison Dashboard**: View original vs. optimized CV side-by-side
- **PDF Export**: Download improved CVs in PDF format
- **Dark Mode**: Toggle between light and dark themes
- **Secure Authentication**: Azure AD integration with MSAL
- **Responsive Design**: Mobile-friendly interface with TailwindCSS

## 🏗️ Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: React Query
- **Authentication**: MSAL (Microsoft Authentication Library)
- **Routing**: React Router v6
- **File Upload**: react-dropzone
- **PDF Generation**: jsPDF / react-pdf

### Backend
- **Runtime**: Azure Functions (Node.js 20)
- **Language**: TypeScript
- **AI Service**: Azure OpenAI
- **Storage**: Azure Blob Storage
- **Secrets**: Azure Key Vault
- **Monitoring**: Application Insights

### Infrastructure
- **Hosting**: Azure App Service (Static Web Apps)
- **API**: Azure Functions
- **Storage**: Azure Storage Account
- **Security**: Azure Key Vault
- **Monitoring**: Azure Application Insights
- **IaC**: Bicep templates
- **CI/CD**: GitHub Actions

## 📋 Prerequisites

- Node.js 20.x or later
- Azure subscription
- Azure OpenAI service access
- Azure CLI installed
- Git

## 🛠️ Local Development Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd JobFitAI
```

### 2. Install dependencies
```bash
npm run install:all
```

### 3. Configure environment variables

**Frontend** (`frontend/.env.local`):
```env
VITE_API_BASE_URL=http://localhost:7071/api
VITE_AZURE_CLIENT_ID=your-azure-ad-client-id
VITE_AZURE_TENANT_ID=your-azure-ad-tenant-id
VITE_AZURE_REDIRECT_URI=http://localhost:5173
```

**Backend** (`backend/local.settings.json`):
```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AZURE_OPENAI_ENDPOINT": "https://your-resource.openai.azure.com/",
    "AZURE_OPENAI_API_KEY": "your-api-key",
    "AZURE_OPENAI_DEPLOYMENT": "gpt-4",
    "AZURE_STORAGE_CONNECTION_STRING": "your-storage-connection",
    "APPLICATIONINSIGHTS_CONNECTION_STRING": "your-app-insights-connection"
  },
  "Host": {
    "CORS": "*"
  }
}
```

### 4. Run the application
```bash
# Start both frontend and backend
npm run dev

# Or run separately
npm run dev:frontend  # Frontend on http://localhost:5173
npm run dev:backend   # Backend on http://localhost:7071
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run frontend tests only
npm run test:frontend

# Run backend tests only
npm run test:backend
```

## 🚀 Azure Deployment

### 1. Provision infrastructure
```bash
cd infrastructure
az login
az deployment sub create \
  --location eastus \
  --template-file main.bicep \
  --parameters main.parameters.json
```

### 2. Deploy via GitHub Actions
- Push to `main` branch triggers automatic deployment
- Secrets required in GitHub repository:
  - `AZURE_CREDENTIALS`
  - `AZURE_OPENAI_API_KEY`
  - `AZURE_STORAGE_CONNECTION_STRING`

### 3. Manual deployment
```bash
# Build
npm run build

# Deploy frontend
cd frontend/dist
az staticwebapp deploy --name <your-static-web-app>

# Deploy backend
cd backend
func azure functionapp publish <your-function-app>
```

## 📁 Project Structure

```
JobFitAI/
├── frontend/                 # React SPA
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Utility functions
│   │   └── styles/          # Global styles
│   ├── public/              # Static assets
│   └── tests/               # Frontend tests
├── backend/                 # Azure Functions
│   ├── src/
│   │   ├── functions/       # Function handlers
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utility functions
│   │   └── types/           # TypeScript types
│   └── tests/               # Backend tests
├── infrastructure/          # Bicep templates
│   ├── main.bicep           # Main infrastructure
│   ├── modules/             # Reusable modules
│   └── parameters/          # Environment configs
├── .github/
│   └── workflows/           # CI/CD pipelines
└── docs/                    # Documentation
```

## 🔒 Security

- All secrets stored in Azure Key Vault
- Managed Identity for Azure service authentication
- Azure AD authentication for users
- HTTPS only communication
- CORS configured for production domains
- Input validation and sanitization
- Rate limiting on API endpoints

## 📊 Monitoring

- Application Insights for telemetry
- Custom metrics for AI operations
- Error tracking and alerting
- Performance monitoring
- User analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions, please open a GitHub issue.
