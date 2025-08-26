# Vercel Deployment Setup

This repository is configured to automatically deploy the `ciprianrarau-site` to Vercel on every push to the main branch.

## Setup Instructions

### 1. Configure GitHub Secrets

Go to your GitHub repository settings:
https://github.com/crarau/ciprianrarau.com/settings/secrets/actions

Add the following secrets:

1. **VERCEL_TOKEN**: `REDACTED_VERCEL_TOKEN` (already provided)
2. **VERCEL_ORG_ID**: `REDACTED_VERCEL_ORG_ID`
3. **VERCEL_PROJECT_ID**: `REDACTED_VERCEL_PROJECT_ID`

### 2. Get Vercel IDs

To get the VERCEL_ORG_ID and VERCEL_PROJECT_ID:

```bash
cd ciprianrarau-site
npx vercel link
```

This will create a `.vercel/project.json` file with the required IDs.

### 3. Deployment

Once the secrets are configured, the site will automatically deploy to Vercel when you:
- Push to the main branch
- Create a pull request

The GitHub Action workflow is located at `.github/workflows/deploy-vercel.yml`.

## Manual Deployment

If you need to deploy manually:

```bash
cd ciprianrarau-site
vercel --prod --token=REDACTED_VERCEL_TOKEN
```