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
  
  const interests = dimScores.interests || 0;
  const values = dimScores.values || 0;
  const workstyle = dimScores.workstyle || 0;
  const context = dimScores.context || 0;
  
  const avgScore = (interests + values + workstyle + context) / 4;
  
  const reasons: string[] = [];
  
  // Check for low scores
  if (avgScore < 50) {
    reasons.push('Keskiarvo alle 50% - oppilas tarvitsee tukea kiinnostuksen kohteiden löytämisessä');
  }
  
  if (interests < 40) {
    reasons.push('Kiinnostukset erittäin alhaiset');
  }
  
  if (values < 40) {
    reasons.push('Arvot eivät ole selkeät');
  }
  
  if (workstyle < 40 && workstyle > 0) {
    reasons.push('Työtapa ei ole selkeä');
  }
  
  // Check for inconsistent responses
  const scores = [interests, values, workstyle, context];
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores.filter(s => s > 0));
  
  if (maxScore - minScore > 60 && minScore > 0) {
    reasons.push('Vastaukset ovat epäjohdonmukaiset - oppilas voi tarvita lisäohjausta');
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

