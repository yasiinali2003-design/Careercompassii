## Supabase Monitoring Setup

### What changed
- `lib/monitoring.ts` introduces a shared helper `reportSupabaseIncident`.
- `lib/supabase.ts` now forwards fetch failures to the monitoring helper.

### Configure alerts
1. Create a webhook endpoint (Slack, Teams, email gateway, etc.).
2. Set the environment variable `SUPABASE_MONITORING_WEBHOOK_URL` in your deployment platform (or export it locally for testing).
3. (Optional) Run `node scripts/test-supabase-monitoring.js` to send a manual payload and confirm the webhook receives it.
4. Deploy the site; when Supabase fetches fail the payload below is posted to the webhook.

```json
{
  "event": "supabase_fetch_error",
  "severity": "error",
  "message": "<error message>",
  "context": {
    "url": "https://...",
    "method": "POST",
    "isProduction": true
  },
  "timestamp": "2025-11-07T12:34:56.000Z",
  "environment": "production"
}
```

If no webhook is configured the helper logs a warning in non-production environments but does not throw. Configure the variable before launch to receive real-time error alerts.
