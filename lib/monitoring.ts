const isProd = process.env.NODE_ENV === 'production';

interface MonitoringPayload {
  event: string;
  severity: 'info' | 'warn' | 'error';
  message: string;
  context?: Record<string, any>;
  timestamp: string;
  environment: string;
}

function buildPayload(event: string, severity: 'info' | 'warn' | 'error', message: string, context?: Record<string, any>): MonitoringPayload {
  return {
    event,
    severity,
    message,
    context,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV ?? 'development'
  };
}

export async function reportSupabaseIncident(event: string, message: string, context?: Record<string, any>) {
  const payload = buildPayload(event, 'error', message, context);
  const webhookUrl = process.env.SUPABASE_MONITORING_WEBHOOK_URL;

  if (!webhookUrl) {
    if (!isProd) {
      console.warn('[Monitoring] SUPABASE_MONITORING_WEBHOOK_URL missing, logging to console only', payload);
    }
    return;
  }

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    if (!isProd) {
      console.error('[Monitoring] Failed to report Supabase incident', { error, fallbackPayload: payload });
    }
  }
}
