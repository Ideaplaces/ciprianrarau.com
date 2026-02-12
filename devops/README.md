# DevOps - ciprianrarau.com

## Vercel Environment Variables

### Prerequisites
```bash
npm install -g vercel
vercel login
```

### List Current Variables
```bash
vercel env ls
```

### Add New Variable
```bash
# Add to specific environment
echo "value" | vercel env add VARIABLE_NAME production
echo "value" | vercel env add VARIABLE_NAME preview
echo "value" | vercel env add VARIABLE_NAME development

# Or add to all environments at once
for env in production preview development; do
  echo "value" | vercel env add VARIABLE_NAME $env
done
```

### Remove Variable
```bash
vercel env rm VARIABLE_NAME production
```

### Pull Variables to Local .env
```bash
vercel env pull .env.local
```

## Current Environment Variables

| Variable | Purpose | Where to get it |
|----------|---------|-----------------|
| `TURNSTILE_SITE_KEY` | Cloudflare CAPTCHA (public) | [Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile) |
| `TURNSTILE_SECRET_KEY` | Cloudflare CAPTCHA (private) | [Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile) |
| `GMAIL_USER` | SMTP sender email | Your Gmail address |
| `GMAIL_APP_PASSWORD` | SMTP authentication | [Google App Passwords](https://myaccount.google.com/apppasswords) |
| `RECIPIENT_EMAIL` | Contact form recipient | Email to receive submissions |
| `RESEND_API_KEY` | Resend API (newsletter) | [Resend API Keys](https://resend.com/api-keys) |
| `RESEND_AUDIENCE_ID` | Resend audience for blog | [Resend Audiences](https://resend.com/audiences) |

## Deployment

Deployment is automated via GitHub Actions on push to `main`.

Workflow: `.github/workflows/deploy-vercel.yml`

GitHub Secrets required:
- `VERCEL_TOKEN` - From [Vercel Tokens](https://vercel.com/account/tokens)
- `VERCEL_ORG_ID` - From `.vercel/project.json`
- `VERCEL_PROJECT_ID` - From `.vercel/project.json`
