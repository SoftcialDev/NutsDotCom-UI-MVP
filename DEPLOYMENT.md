# Azure Deployment Guide

This guide will help you deploy the Complaints Analyzer app to Azure Static Web Apps (free tier available).

## Prerequisites

1. **Azure Account** - Sign up at [azure.com](https://azure.microsoft.com/free/) (free tier available)
2. **GitHub Account** - For CI/CD deployment
3. **Azure CLI** (optional) - For command-line deployment

## Option 1: Deploy via Azure Portal (Recommended - Easiest)

### Step 1: Create Azure Static Web App

1. Go to [Azure Portal](https://portal.azure.com)
2. Click **"Create a resource"**
3. Search for **"Static Web App"** and select it
4. Click **"Create"**

### Step 2: Configure Static Web App

Fill in the form:

- **Subscription**: Choose your subscription
- **Resource Group**: Create new or use existing
- **Name**: `nuts-complaints-analyzer` (or your preferred name)
- **Plan type**: **Free** (cheapest option)
- **Region**: Choose closest to you (e.g., `East US`, `West Europe`)
- **Source**: **GitHub**
- **Sign in with GitHub**: Authorize Azure to access your GitHub
- **Organization**: Your GitHub username
- **Repository**: Select your repository
- **Branch**: `main` (or `master`)
- **Build Presets**: **Custom**
- **App location**: `/` (root)
- **Api location**: Leave empty (your API is separate)
- **Output location**: `dist`

### Step 3: Configure Build Settings

After creation, go to **Configuration** → **Build** and set:

- **App artifact location**: `dist`
- **Build command**: `pnpm install && pnpm run build`
- **API location**: (leave empty)

### Step 4: Set Environment Variables

1. Go to **Configuration** → **Application settings**
2. Add new application setting:
   - **Name**: `VITE_API_URL`
   - **Value**: Your Azure Function App URL (e.g., `https://your-function-app.azurewebsites.net`)

### Step 5: Deploy

1. Push your code to the `main` branch on GitHub
2. Azure will automatically build and deploy your app
3. Check the **Actions** tab in your GitHub repo to see deployment progress
4. Once deployed, your app will be available at: `https://your-app-name.azurestaticapps.net`

## Option 2: Deploy via Azure CLI

### Step 1: Install Azure CLI

```bash
# Windows (via PowerShell)
Invoke-WebRequest -Uri https://aka.ms/installazurecliwindows -OutFile .\AzureCLI.msi
Start-Process msiexec.exe -Wait -ArgumentList '/I AzureCLI.msi /quiet'
```

### Step 2: Login to Azure

```bash
az login
```

### Step 3: Create Static Web App

```bash
# Create resource group
az group create --name myResourceGroup --location eastus

# Create static web app
az staticwebapp create \
  --name nuts-complaints-analyzer \
  --resource-group myResourceGroup \
  --sku Free \
  --location "East US 2" \
  --branch main \
  --app-location "/" \
  --output-location "dist" \
  --login-with-github
```

### Step 4: Set Environment Variable

```bash
az staticwebapp appsettings set \
  --name nuts-complaints-analyzer \
  --resource-group myResourceGroup \
  --setting-names VITE_API_URL=https://your-function-app.azurewebsites.net
```

## Option 3: Manual Deployment (No GitHub Required)

### Step 1: Build the App

```bash
# Install dependencies
pnpm install

# Build for production
pnpm run build
```

### Step 2: Deploy Using Azure Static Web Apps CLI

```bash
# Install SWA CLI
npm install -g @azure/static-web-apps-cli

# Login to Azure
az login

# Deploy
swa deploy ./dist --app-name nuts-complaints-analyzer --resource-group myResourceGroup
```

## Deploying Your API (Azure Functions)

Since your app calls `http://localhost:7071/api/complaints`, you'll need to deploy your Azure Function separately:

### Step 1: Create Function App

1. In Azure Portal, create a new **Function App**
2. Choose **Consumption Plan** (pay-per-use, cheapest option)
3. Set runtime stack to match your function (Node.js, Python, etc.)

### Step 2: Deploy Function

```bash
# Using Azure Functions Core Tools
func azure functionapp publish your-function-app-name
```

### Step 3: Update API URL

Update the `VITE_API_URL` environment variable in your Static Web App to point to your Function App URL.

## Cost Breakdown (Free Tier)

- **Azure Static Web Apps**: **FREE** (up to 100 GB bandwidth/month)
- **Azure Functions (Consumption Plan)**: **FREE** (1 million requests/month)
- **Total**: **$0/month** for low to moderate traffic

## Custom Domain (Optional)

1. Go to your Static Web App → **Custom domains**
2. Add your domain
3. Follow DNS configuration instructions

## Troubleshooting

### Build Fails

- Check GitHub Actions logs
- Ensure `pnpm` is available (we use pnpm due to npm bug with Rollup)
- Verify build command: `pnpm install && pnpm run build`

### API Calls Fail

- Check CORS settings in your Azure Function
- Verify `VITE_API_URL` environment variable is set correctly
- Ensure your Function App allows requests from your Static Web App domain

### 404 Errors on Routes

- The `staticwebapp.config.json` file should handle this
- Verify the file is in the root directory

## Next Steps

1. **Set up CI/CD**: Already configured via GitHub Actions
2. **Monitor**: Use Azure Portal to monitor usage and performance
3. **Scale**: If you exceed free tier, upgrade to Standard plan ($9/month)

## Support

- [Azure Static Web Apps Documentation](https://docs.microsoft.com/azure/static-web-apps/)
- [Azure Functions Documentation](https://docs.microsoft.com/azure/azure-functions/)


