# GitHub Codespaces Development Container

This configuration sets up a complete development environment for JobFitAI in GitHub Codespaces.

## What's Included

### Runtime & Tools
- **Node.js 20 LTS** - JavaScript/TypeScript runtime
- **npm** - Package manager
- **Azure CLI** - For Azure resource management
- **GitHub CLI** - For GitHub operations
- **Azure Developer CLI (azd)** - For Azure deployment
- **Azure Functions Core Tools** - For local function development

### VS Code Extensions
- ESLint - Code linting
- Prettier - Code formatting
- Azure Functions - Function app development
- Bicep - Infrastructure as code
- Tailwind CSS IntelliSense - CSS utility class autocomplete
- GitHub Copilot - AI-powered coding assistant

### Ports
- **5173** - Frontend (Vite dev server) - Opens automatically in browser
- **7071** - Backend (Azure Functions) - Notification on forward

## Getting Started

1. **Open in Codespaces**
   - Click "Code" → "Codespaces" → "Create codespace on main"
   - Wait for the container to build and dependencies to install

2. **Run the Application**
   ```bash
   # Start frontend
   npm run dev:frontend
   
   # Start backend (in a new terminal)
   npm run dev:backend
   ```

3. **Access the Application**
   - Frontend: Automatically opens in your browser
   - Backend API: `http://localhost:7071`

## Environment Variables

Create these files before running:

### Frontend (.env.local)
```env
VITE_API_BASE_URL=http://localhost:7071/api
VITE_AZURE_CLIENT_ID=mock-client-id
VITE_AZURE_TENANT_ID=mock-tenant-id
VITE_AZURE_REDIRECT_URI=http://localhost:5173
VITE_ENABLE_AUTH=false
```

### Backend (local.settings.json)
```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AZURE_OPENAI_ENDPOINT": "your-endpoint",
    "AZURE_OPENAI_API_KEY": "your-key",
    "AZURE_OPENAI_DEPLOYMENT_NAME": "gpt-4"
  }
}
```

## Azure Authentication

The container automatically mounts your local Azure credentials if you've authenticated on your local machine. To authenticate in Codespaces:

```bash
az login
```

## Troubleshooting

### Dependencies not installed
```bash
npm run install:all
```

### Azure Functions Core Tools not found
```bash
npm install -g azure-functions-core-tools@4 --unsafe-perm true
```

### Port forwarding issues
- Check "Ports" panel in VS Code
- Ensure ports 5173 and 7071 are forwarded
- Make visibility "Public" if needed

## Development Workflow

1. Make changes to code
2. Frontend auto-reloads on save
3. Backend requires restart for changes
4. Run tests: `npm test`
5. Build for production: `npm run build`

## Deploying from Codespaces

```bash
# Login to Azure
az login

# Deploy infrastructure
cd infrastructure
az deployment sub create \
  --location uksouth \
  --template-file main.bicep \
  --parameters main.bicepparam

# Deploy backend
cd ../backend
func azure functionapp publish <function-app-name>

# Deploy frontend
cd ../frontend
npm run build
# Use Azure Static Web Apps deployment
```
