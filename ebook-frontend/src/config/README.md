# 🔧 Environment Configuration Guide

## Quick Start

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Update the values** in `.env` according to your environment

3. **Restart the dev server** if it's already running:
   ```bash
   npm run dev
   ```

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8080/api/v1` |
| `VITE_APP_NAME` | Application name | `E-Book Reader` |

### Optional Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `VITE_APP_VERSION` | Application version | `1.0.0` | `1.0.0` |
| `VITE_ENVIRONMENT` | Current environment | `development` | `development`, `staging`, `production` |
| `VITE_ENABLE_ANALYTICS` | Enable analytics tracking | `false` | `true`, `false` |
| `VITE_ENABLE_DEBUG` | Enable debug mode | `true` | `true`, `false` |
| `VITE_GOOGLE_ANALYTICS_ID` | Google Analytics ID | - | `G-XXXXXXXXXX` |
| `VITE_SENTRY_DSN` | Sentry error tracking DSN | - | `https://xxx@sentry.io/xxx` |

## Environment-Specific Files

You can create environment-specific files:

- `.env` - Default (development)
- `.env.local` - Local overrides (not committed to git)
- `.env.production` - Production environment
- `.env.staging` - Staging environment

## Important Notes

⚠️ **Security:**
- Never commit `.env` files to git
- Only commit `.env.example` as a template
- Keep sensitive data (API keys, tokens) in `.env.local`

⚠️ **Vite Requirement:**
- All environment variables **must** be prefixed with `VITE_`
- Variables without this prefix won't be exposed to the client

⚠️ **Changes:**
- After changing `.env` values, restart the dev server
- Environment variables are embedded at build time

## Usage in Code

Import the config object instead of using `import.meta.env` directly:

```typescript
import { config } from '@/config/environment';

// ✅ Good
const apiUrl = config.apiBaseUrl;

// ❌ Avoid
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

## Troubleshooting

### Variables not updating?
1. Restart the dev server
2. Clear browser cache
3. Check if variable is prefixed with `VITE_`

### Missing required variables?
Check the console - the app will throw an error listing missing variables.

### Need to add a new variable?
1. Add to `.env`
2. Add to `.env.example` (without sensitive values)
3. Update `src/config/environment.ts` interface and config object
4. Update this documentation
