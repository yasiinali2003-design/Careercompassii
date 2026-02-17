/**
 * Release A Week 3 Day 1: Client-Side Metrics Tracking Utilities
 *
 * Simple utilities to track the 3 core metrics:
 * 1. careerClickRate - Track when users click on career cards
 * 2. teacherFeedback - Track teacher ratings (1-5)
 * 3. noneRelevantRate - Track when users click "Ei mikään näistä sovi"
 */

import type {
  MetricsEvent,
  CareerClickData,
  NoneRelevantData,
  TeacherFeedbackData,
  SessionStartData,
  SessionCompleteData
} from './types';

/**
 * Generate or retrieve session ID
 * Stored in sessionStorage to persist across page reloads during same session
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') return '';

  const storageKey = 'urakompassi_session_id';
  let sessionId = sessionStorage.getItem(storageKey);

  if (!sessionId) {
    // Generate unique session ID: timestamp + random string
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem(storageKey, sessionId);
  }

  return sessionId;
}

/**
 * Track a metric event by sending to /api/metrics
 */
async function trackEvent(event: MetricsEvent): Promise<boolean> {
  try {
    const response = await fetch('/api/metrics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    });

    if (!response.ok) {
      console.error('[metrics] Failed to track event:', await response.text());
      return false;
    }

    const result = await response.json();
    console.log('[metrics] Event tracked:', event.event_type, result);
    return true;

  } catch (error) {
    console.error('[metrics] Error tracking event:', error);
    return false;
  }
}

/**
 * Track when user clicks on a career card
 * Core Metric 1: careerClickRate
 */
export async function trackCareerClick(
  careerSlug: string,
  careerTitle: string,
  rank: number,
  overallScore: number,
  category: string,
  cohort: string,
  subCohort?: string
): Promise<void> {
  const sessionId = getSessionId();

  const eventData: CareerClickData = {
    career_slug: careerSlug,
    career_title: careerTitle,
    rank,
    overall_score: overallScore,
    category
  };

  await trackEvent({
    session_id: sessionId,
    event_type: 'career_click',
    event_data: eventData,
    cohort,
    sub_cohort: subCohort
  });
}

/**
 * Track when user clicks "Ei mikään näistä sovi" (None of these fit)
 * Core Metric 3: noneRelevantRate
 */
export async function trackNoneRelevant(
  topCareers: string[],
  cohort: string,
  subCohort?: string,
  optionalReason?: string
): Promise<void> {
  const sessionId = getSessionId();

  const eventData: NoneRelevantData = {
    top_careers: topCareers,
    optional_reason: optionalReason
  };

  await trackEvent({
    session_id: sessionId,
    event_type: 'none_relevant',
    event_data: eventData,
    cohort,
    sub_cohort: subCohort
  });
}

/**
 * Track teacher feedback rating (1-5)
 * Core Metric 2: teacherFeedback
 */
export async function trackTeacherFeedback(
  rating: number,
  cohort: string,
  subCohort?: string,
  teacherId?: string,
  classId?: string,
  comments?: string
): Promise<void> {
  // Validate rating
  if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
    console.error('[metrics] Invalid teacher feedback rating:', rating);
    return;
  }

  const sessionId = getSessionId();

  const eventData: TeacherFeedbackData = {
    rating,
    teacher_id: teacherId,
    class_id: classId,
    comments
  };

  await trackEvent({
    session_id: sessionId,
    event_type: 'teacher_feedback',
    event_data: eventData,
    cohort,
    sub_cohort: subCohort
  });
}

/**
 * Track when user views results page (session start)
 */
export async function trackSessionStart(
  topCareers: string[],
  categories: string[],
  cohort: string,
  subCohort?: string
): Promise<void> {
  const sessionId = getSessionId();

  const eventData: SessionStartData = {
    top_careers: topCareers,
    categories
  };

  await trackEvent({
    session_id: sessionId,
    event_type: 'session_start',
    event_data: eventData,
    cohort,
    sub_cohort: subCohort
  });
}

/**
 * Track when user finishes reviewing results (session complete)
 */
export async function trackSessionComplete(
  careersClicked: number,
  timeOnPage: number,
  cohort: string,
  subCohort?: string
): Promise<void> {
  const sessionId = getSessionId();

  const eventData: SessionCompleteData = {
    careers_clicked: careersClicked,
    time_on_page: timeOnPage
  };

  await trackEvent({
    session_id: sessionId,
    event_type: 'session_complete',
    event_data: eventData,
    cohort,
    sub_cohort: subCohort
  });
}

/**
 * React hook for tracking time on page
 * Usage: const trackTimeOnPage = useTimeOnPage();
 *        useEffect(() => trackTimeOnPage(cohort), []);
 */
export function useTimeOnPage() {
  if (typeof window === 'undefined') return () => {};

  let startTime = Date.now();

  return (cohort: string, subCohort?: string) => {
    const timeOnPage = Math.round((Date.now() - startTime) / 1000); // seconds
    const careersClicked = parseInt(sessionStorage.getItem('careers_clicked') || '0', 10);

    trackSessionComplete(careersClicked, timeOnPage, cohort, subCohort);
  };
}

/**
 * Increment career click counter (used for session_complete tracking)
 */
export function incrementCareerClickCounter(): void {
  if (typeof window === 'undefined') return;

  const current = parseInt(sessionStorage.getItem('careers_clicked') || '0', 10);
  sessionStorage.setItem('careers_clicked', (current + 1).toString());
}
