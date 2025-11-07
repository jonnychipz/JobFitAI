# Quick Start Guide - JobFitAI CV Explorer

## 🚀 Get Started in 10 Minutes

This guide will help you get the JobFitAI application running locally on your machine.

## Prerequisites

Before you begin, ensure you have:

- [ ] **Node.js 20+** installed ([Download](https://nodejs.org/))
- [ ] **Git** installed
- [ ] **Code editor** (VS Code recommended)
- [ ] **Azure account** (for OpenAI API)

## Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/JobFitAI.git
cd JobFitAI
```

## Step 2: Install Dependencies

Install all dependencies for both frontend and backend:

```bash
npm run install:all
```

This single command will:

- Install root dependencies
- Install frontend dependencies
- Install backend dependencies

## Step 3: Configure Environment Variables

### Frontend Configuration

Create `frontend/.env.local`:

```bash
cd frontend
cp .env.example .env.local
```

Edit `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:7071/api
VITE_AZURE_CLIENT_ID=your-client-id-here
VITE_AZURE_TENANT_ID=your-tenant-id-here
VITE_AZURE_REDIRECT_URI=http://localhost:5173
VITE_ENABLE_AUTH=false
```

> **Note:** For local development without authentication, keep `VITE_ENABLE_AUTH=false`

### Backend Configuration

Create `backend/local.settings.json`:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AZURE_OPENAI_ENDPOINT": "https://YOUR-RESOURCE.openai.azure.com/",
    "AZURE_OPENAI_API_KEY": "your-api-key-here",
    "AZURE_OPENAI_DEPLOYMENT": "gpt-4",
    "AZURE_OPENAI_API_VERSION": "2024-02-15-preview",
    "ALLOWED_ORIGINS": "http://localhost:5173",
    "MAX_FILE_SIZE_MB": "10"
  },
  "Host": {
    "CORS": "*"
  }
}
```

> **Note:** For testing without Azure OpenAI, the health check endpoint will still work. Full CV analysis features require valid Azure OpenAI credentials.

### Get Azure OpenAI Credentials (Optional)

Azure OpenAI is required for full CV analysis features. The app will run in test mode without it.

**To enable full features:**

1. Go to [Azure Portal](https://portal.azure.com)
2. Create an Azure OpenAI resource
3. Deploy a GPT-4 model
4. Get the endpoint and API key
5. Update `backend/local.settings.json`

**Quick Azure CLI commands:**

```bash
# Create Azure OpenAI resource
az cognitiveservices account create \
  --name jobfitai-openai-dev \
  --resource-group jobfitai-dev-rg \
  --kind OpenAI \
  --sku S0 \
  --location eastus

# Get the endpoint
az cognitiveservices account show \
  --name jobfitai-openai-dev \
  --resource-group jobfitai-dev-rg \
  --query properties.endpoint

# Get the API key
az cognitiveservices account keys list \
  --name jobfitai-openai-dev \
  --resource-group jobfitai-dev-rg \
  --query key1
```

## Step 4: Start the Development Servers

### Option A: Start Everything at Once (Recommended)

From the project root:

```bash
npm run dev
```

This will start:

- ✅ Frontend dev server on `http://localhost:5173`
- ✅ Backend Functions on `http://localhost:7071`

### Option B: Start Separately

**Terminal 1 - Backend:**

```bash
cd backend
npm run build
npm start
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

## Step 5: Verify Everything Works

### Check Backend Health

Open your browser or use curl:

```bash
curl http://localhost:7071/api/health
```

Expected response:

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2025-11-07T...",
    "version": "1.0.0"
  }
}
```

### Check Frontend

Open your browser to:

```
http://localhost:5173
```

You should see the JobFitAI landing page!

## 🎉 You're Ready!

Now you can:

1. **Upload a CV**: Click "Get Started" or go to Upload page
2. **Test the UI**: Try the dark mode toggle
3. **Explore the app**: Navigate through different pages

## 📝 Quick Feature Tour

### Current Features

The application currently has:

1. **Home Page** (`/`)

   - Landing page with app overview
   - Privacy notice explaining no-data-retention policy
   - Call-to-action buttons

2. **Upload Page** (`/upload`)

   - Drag & drop CV file upload (PDF, DOCX, TXT)
   - Text paste option for CV content
   - Privacy notice reminder
   - File validation

3. **CV Analysis Page** (`/analysis`)
   - AI-powered CV analysis results (UI ready)
   - ATS score with color-coded visualization
   - Career insights (level, industry fit)
   - Critical improvements list
   - Keyword suggestions
   - Skill gap analysis
   - Next steps recommendations

### Features In Development

- Backend integration for actual AI processing
- CV parsing with Azure OpenAI
- Real-time analysis feedback
- CV history and management
- Job matching functionality

## 🛠️ Development Workflow

### Making Changes

**Frontend:**

- Edit files in `frontend/src/`
- Hot reload is enabled (instant updates)
- Check console for errors

**Backend:**

- Edit files in `backend/src/`
- Run `npm run build` in backend folder
- Functions will reload automatically

### Running Tests

**Frontend tests:**

```bash
cd frontend
npm test
```

**Backend tests:**

```bash
cd backend
npm test
```

**All tests:**

```bash
npm test
```

### Code Linting

**Frontend:**

```bash
cd frontend
npm run lint
npm run type-check
```

### Building for Production

**Frontend:**

```bash
cd frontend
npm run build
# Output in frontend/dist/
```

**Backend:**

```bash
cd backend
npm run build
# Output in backend/dist/
```

## 🐛 Troubleshooting

### Issue: "Cannot find module '@azure/functions'"

**Solution:**

```bash
cd backend
npm install
```

### Issue: Port 7071 already in use

**Solution:**

```bash
# Find process using port 7071
netstat -ano | findstr :7071

# Kill the process (Windows)
taskkill /PID <process-id> /F

# Or use a different port
```

### Issue: Frontend can't connect to backend

**Solution:**

1. Verify backend is running on `http://localhost:7071`
2. Check CORS settings in `backend/local.settings.json`
3. Verify `VITE_API_BASE_URL` in `frontend/.env.local`

### Issue: OpenAI API errors

**Solution:**

1. Verify API key is correct
2. Check endpoint URL format
3. Ensure deployment name matches
4. Check Azure OpenAI quota/limits

### Issue: Build errors with TypeScript

**Solution:**

```bash
# Clean install
rm -rf node_modules frontend/node_modules backend/node_modules
npm run install:all

# Clear TypeScript cache
npx tsc --build --clean
```

## 📚 Next Steps

### Explore the Code

**Key files to check out:**

- `frontend/src/App.tsx` - Main app routes (Home, Upload, Analysis)
- `frontend/src/components/CVUpload.tsx` - File upload component
- `frontend/src/components/PrivacyNotice.tsx` - Privacy compliance component
- `frontend/src/pages/CVAnalysisPage.tsx` - AI analysis results page (UI ready)
- `backend/src/app.ts` - Functions app entry point
- `backend/src/services/openaiService.ts` - AI integration (ready for implementation)

### Add Features

Current priorities:

- Connect CV Analysis page to backend API
- Implement CV parsing with Azure OpenAI
- Add CV file storage and retrieval
- Build job matching functionality
- Create career insights generator
- Add user authentication (MSAL)

### Deploy to Azure

When ready to deploy:

1. Follow `docs/DEPLOYMENT.md`
2. Set up GitHub Actions secrets
3. Push to main branch
4. Watch automated deployment

## 🆘 Get Help

### Resources

- **Documentation**: Check `docs/` folder
- **Architecture**: Read `docs/ARCHITECTURE.md`
- **Deployment**: See `docs/DEPLOYMENT.md`
- **Issues**: Open a GitHub issue

### Common Commands Reference

```bash
# Install everything
npm run install:all

# Start dev servers
npm run dev

# Run tests
npm test

# Build everything
npm run build

# Frontend only
cd frontend && npm run dev

# Backend only
cd backend && npm start

# Type checking
cd frontend && npm run type-check

# Linting
cd frontend && npm run lint
```

## ✅ Checklist for First-Time Setup

- [ ] Node.js 20+ installed
- [ ] Repository cloned
- [ ] Dependencies installed (`npm run install:all`)
- [ ] Frontend `.env.local` created and configured
- [ ] Backend `local.settings.json` created and configured
- [ ] Azure OpenAI credentials obtained
- [ ] Backend running on port 7071
- [ ] Frontend running on port 5173
- [ ] Health check endpoint working
- [ ] Frontend loads in browser
- [ ] CV upload tested

## 🎯 Ready to Build!

You now have a fully functional local development environment for JobFitAI. Start building amazing features and enhancing the CV analysis capabilities!

**Happy coding! 🚀**
