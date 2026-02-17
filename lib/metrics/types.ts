/**
 * Release A Week 3 Day 1: Core Metrics Types
 *
 * Tracks 3 simple metrics to evaluate recommendation quality:
 * 1. careerClickRate: % of users who click ≥1 recommended career
 * 2. teacherFeedback: 1-5 rating after OPO session
 * 3. noneRelevantRate: % of sessions where student says "none fit"
 */

export interface MetricsEvent {
  id?: string;
  session_id: string;
  event_type: MetricEventType;
  event_data: MetricEventData;
  cohort: string;
  sub_cohort?: string;
  created_at?: string;
}

export type MetricEventType =
  | 'career_click'           // User clicked on a career card
  | 'none_relevant'          // User clicked "Ei mikään näistä sovi"
  | 'teacher_feedback'       // Teacher submitted 1-5 rating
  | 'session_start'          // User viewed results page
  | 'session_complete';      // User finished reviewing results

export interface CareerClickData {
  career_slug: string;
  career_title: string;
  rank: number;              // Position in top 10 (1-10)
  overall_score: number;
  category: string;
}

export interface NoneRelevantData {
  top_careers: string[];     // Slugs of careers shown
  optional_reason?: string;  // Optional text feedback
}

export interface TeacherFeedbackData {
  rating: number;            // 1-5
  teacher_id?: string;       // Optional teacher identifier
  class_id?: string;         // Optional class identifier
  comments?: string;         // Optional feedback text
}

export interface SessionStartData {
  top_careers: string[];     // Slugs of top 10 careers
  categories: string[];      // Categories represented
}

export interface SessionCompleteData {
  careers_clicked: number;   // How many careers user clicked
  time_on_page: number;      // Seconds spent on results page
}

export type MetricEventData =
  | CareerClickData
  | NoneRelevantData
  | TeacherFeedbackData
  | SessionStartData
  | SessionCompleteData;

/**
 * Aggregated metrics for analytics dashboard
 */
export interface MetricsSummary {
  // Core Metric 1: Career Click Rate
  careerClickRate: {
    total_sessions: number;
    sessions_with_clicks: number;
    click_rate: number;        // Percentage (0-100)
  };

  // Core Metric 2: Teacher Feedback
  teacherFeedback: {
    total_ratings: number;
    average_rating: number;    // 1-5
    rating_distribution: {
      [key: number]: number;   // Count of each rating (1-5)
    };
  };

  // Core Metric 3: None Relevant Rate
  noneRelevantRate: {
    total_sessions: number;
    none_relevant_count: number;
    none_relevant_rate: number; // Percentage (0-100)
  };

  // Additional context
  cohort_breakdown?: {
    [cohort: string]: Partial<MetricsSummary>;
  };

  time_period: {
    start_date: string;
    end_date: string;
  };
}

/**
 * Query parameters for metrics analytics
 */
export interface MetricsQuery {
  start_date?: string;
  end_date?: string;
  cohort?: string;
  sub_cohort?: string;
  event_type?: MetricEventType;
}
