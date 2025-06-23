# Deployment Instructions

## Azure Web App Configuration

### Environment Variables Required

Set these environment variables in your Azure Web App configuration (Settings > Configuration > Application settings):

#### API Configuration
- `NEXT_PUBLIC_API_BASE_URL` - Your backend API URL
- `NEXT_PUBLIC_HOST_DOMAIN` - https://kioskhealthappfelin-c7fva9dfhsgzadef.uaenorth-01.azurewebsites.net

#### Payload CMS Configuration
- `PAYLOAD_SECRET` - A secure secret key for Payload CMS
- `DATABASE_URI` - Your MongoDB connection string

#### Node Configuration
- `NODE_ENV` - Set to `production`

### Azure Web App Settings

1. **Runtime**: Node 22 LTS
2. **Startup Command**: `npm start`
3. **Platform**: Linux
4. **Always On**: Enabled (if using Basic plan or higher)

### GitHub Secrets

Ensure your GitHub repository has this secret:
- `AZUREAPPSERVICE_PUBLISHPROFILE_AE099D32111649DDB292BC51C0E67F96` - Your Azure publish profile

## Fixes Applied

1. **Removed deployment slot configuration** - Not supported on Basic plan
2. **Removed web.config** - Not needed for Next.js on Azure
3. **Added standalone output** - Optimizes for Azure deployment
4. **Fixed CORS configuration** - Production-ready settings
5. **Updated build process** - Uses npm ci for faster, reliable builds
6. **Removed Supabase completely** - Unused legacy database dependencies cleaned up

## Local Development

When developing locally, create a `.env.local` file with the same variables listed above, but use your development values.

## Deployment Process

The deployment happens automatically when you push to the main branch via GitHub Actions. 