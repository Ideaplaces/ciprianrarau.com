# DevOps - ciprianrarau.com

## Environment Variables

The following environment variables are required for the application to function. They are configured as Azure Web App settings.

| Variable | Purpose | Where to get it |
|----------|---------|-----------------|
| `TURNSTILE_SITE_KEY` | Cloudflare CAPTCHA (public) | [Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile) |
| `TURNSTILE_SECRET_KEY` | Cloudflare CAPTCHA (private) | [Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile) |
| `RESEND_API_KEY` | Resend API (contact form + newsletter) | [Resend API Keys](https://resend.com/api-keys) |
| `RESEND_AUDIENCE_ID` | Resend audience for blog | [Resend Audiences](https://resend.com/audiences) |
| `RECIPIENT_EMAIL` | Contact form recipient | Email to receive submissions |

## Deployment

Deployment is automated via GitHub Actions on push to `main`.

Workflow: `.github/workflows/deploy.yml`

The pipeline builds a Docker image, pushes to Azure Container Registry, deploys to a staging slot, health checks, then swaps to production (zero downtime).

### GitHub Secrets required

| Secret | Purpose |
|--------|---------|
| `AZURE_CLIENT_ID` | Azure service principal for OIDC auth |
| `AZURE_TENANT_ID` | Azure AD tenant |
| `AZURE_SUBSCRIPTION_ID` | Azure subscription |
| `DISCORD_WEBHOOK_CHIP_LUCA` | Discord webhook for failure notifications |

### GitHub Variables required

| Variable | Purpose |
|----------|---------|
| `AZURE_WEBAPP_NAME` | Azure Web App name |
| `ACR_NAME` | Azure Container Registry name |
| `ACR_LOGIN_SERVER` | ACR login server URL |
| `AZURE_RESOURCE_GROUP` | Azure resource group |
| `AZURE_KEYVAULT_NAME` | Azure Key Vault (used by Substack sync) |
