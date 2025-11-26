# Sentry Error Monitoring Setup Guide

## Overview

Sentry error monitoring has been configured for CareerCompassi to track errors and performance issues in production.

## Current Status

✅ Sentry package installed (`@sentry/nextjs`)
✅ Configuration files created:
- [sentry.client.config.ts](sentry.client.config.ts) - Client-side error tracking
- [sentry.server.config.ts](sentry.server.config.ts) - Server-side error tracking
- [sentry.edge.config.ts](sentry.edge.config.ts) - Edge runtime error tracking

⚠️ **DSN not yet configured** - Sentry will not send errors until you add a DSN

## To Enable Sentry (Before Production):

### 1. Create a Sentry Account
1. Go to [sentry.io](https://sentry.io)
2. Sign up for a free account
3. Create a new project for "Next.js"

### 2. Get Your DSN
After creating the project, Sentry will show you a DSN that looks like:
```
https://abc123def456...@o123456.ingest.sentry.io/7654321
```

### 3. Add DSN to Environment Variables

Add this line to your `.env.local` file:
```bash
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn-here@sentry.io/your-project-id
```

### 4. Restart the Development Server
```bash
npm run dev
```

## What Gets Tracked

Once configured, Sentry will automatically track:
- ✅ Client-side JavaScript errors
- ✅ Server-side errors
- ✅ Edge runtime errors
- ✅ Performance metrics
- ✅ Session replays (on error)

## Testing Sentry

To test that Sentry is working after adding the DSN:

1. Add a test error to any page:
```typescript
throw new Error("Test Sentry error tracking");
```

2. Trigger the error in your browser
3. Check the Sentry dashboard - you should see the error appear within seconds

## Configuration Notes

- **Sample Rate**: Currently set to 100% (all errors tracked) - adjust in production
- **Debug Mode**: Disabled - enable by setting `debug: true` in config files if needed
- **Session Replay**: Enabled for errors only, 10% for normal sessions
- **Privacy**: All text and media are masked in session replays

## Cost

- Free tier: 5,000 errors/month, 50 replays/month
- Should be sufficient for pilot phase

## Next Steps (Production)

1. Enable Sentry by adding DSN
2. Set up error alerts in Sentry dashboard
3. Configure Finnish error messages in Sentry UI
4. Set up team notifications (email/Slack)
5. Review and adjust sample rates based on usage

