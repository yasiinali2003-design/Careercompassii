#!/usr/bin/env node

const webhookUrl = process.env.SUPABASE_MONITORING_WEBHOOK_URL;

if (!webhookUrl) {
  console.error('[Monitoring Test] SUPABASE_MONITORING_WEBHOOK_URL is not set.');
  console.error('Export the variable or add it to your environment before running this test.');
  process.exit(1);
}

const payload = {
  event: 'supabase_monitoring_test',
  severity: 'info',
  message: 'Test payload from test-supabase-monitoring.js',
  text: '[INFO] supabase_monitoring_test: Test payload from test-supabase-monitoring.js',
  context: {
    triggeredBy: 'manual-test-script',
    timestamp: new Date().toISOString()
  },
  environment: process.env.NODE_ENV ?? 'development'
};

async function sendTestPayload() {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error(`[Monitoring Test] Webhook responded with status ${response.status}`);
      const text = await response.text();
      console.error(text);
      process.exit(1);
    }

    console.log('[Monitoring Test] Payload sent successfully.');
  } catch (error) {
    console.error('[Monitoring Test] Failed to send payload:', error);
    process.exit(1);
  }
}

sendTestPayload();
