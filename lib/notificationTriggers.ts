/**
 * Notification Triggers
 * Functions to check conditions and trigger notifications
 */

export interface NotificationCheckResult {
  shouldNotify: boolean;
  data?: any;
}

/**
 * Check if class completion notification should be sent
 */
export function checkClassCompletion(
  totalStudents: number,
  completedStudents: number,
  lastNotificationSent?: Date
): NotificationCheckResult {
  const completionRate = (completedStudents / totalStudents) * 100;
  const isComplete = completedStudents === totalStudents;
  
  // Send notification if:
  // 1. All students completed (100%)
  // 2. 75% completed and last notification was more than 24h ago
  const shouldNotify = isComplete || 
    (completionRate >= 75 && (!lastNotificationSent || 
      Date.now() - lastNotificationSent.getTime() > 24 * 60 * 60 * 1000));

  return {
    shouldNotify,
    data: {
      totalStudents,
      completedStudents,
      completionRate
    }
  };
}

/**
 * Check if student is at risk and needs attention
 */
export function checkAtRiskStudent(result: any): NotificationCheckResult {
  const payload = result.result_payload || {};
  const dimScores = payload.dimension_scores || payload.dimensionScores || {};

  // Normalize scores - API returns 0-1 fractions, but we need 0-100 percentages
  // If max value is <= 1, multiply by 100
  const rawInterests = dimScores.interests || 0;
  const rawValues = dimScores.values || 0;
  const rawWorkstyle = dimScores.workstyle || 0;
  const rawContext = dimScores.context || 0;

  const maxRaw = Math.max(rawInterests, rawValues, rawWorkstyle, rawContext);
  const multiplier = maxRaw > 0 && maxRaw <= 1 ? 100 : 1;

  const interests = rawInterests * multiplier;
  const values = rawValues * multiplier;
  const workstyle = rawWorkstyle * multiplier;
  const context = rawContext * multiplier;
  
  const avgScore = (interests + values + workstyle + context) / 4;
  
  const reasons: string[] = [];
  
  // Check for indicators that student could benefit from guidance
  if (avgScore < 50) {
    reasons.push('Voisi hyötyä ohjauskeskustelusta kiinnostuksen kohteiden kartoittamiseksi');
  }

  if (interests < 40) {
    reasons.push('Kiinnostuksen kohteet eivät vielä selkeytyneet');
  }

  if (values < 40) {
    reasons.push('Arvomaailma vielä hahmottumassa');
  }

  if (workstyle < 40 && workstyle > 0) {
    reasons.push('Oppimistyylin tunnistaminen kesken');
  }

  // Check for inconsistent responses
  const scores = [interests, values, workstyle, context];
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores.filter(s => s > 0));

  if (maxScore - minScore > 60 && minScore > 0) {
    reasons.push('Vastaukset vaihtelevat - henkilökohtainen keskustelu voisi auttaa');
  }
  
  const shouldNotify = reasons.length > 0;
  
  return {
    shouldNotify,
    data: reasons.length > 0 ? { reasons } : undefined
  };
}

/**
 * Trigger notification by calling API
 */
export async function triggerNotification(
  type: 'class_completion' | 'at_risk_student' | 'weekly_summary',
  data: any
): Promise<boolean> {
  try {
    const response = await fetch('/api/notifications/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, data }),
    });

    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error('Error triggering notification:', error);
    return false;
  }
}

