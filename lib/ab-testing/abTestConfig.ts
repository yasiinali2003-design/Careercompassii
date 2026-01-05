/**
 * A/B TESTING CONFIGURATION
 *
 * Allows testing the impact of category expansion on recommendation quality
 * Users are randomly assigned to control (old) or treatment (new) groups
 */

import { safeGetString, safeSetString, safeRemoveItem } from '../safeStorage';

export type ABTestVariant = 'control' | 'treatment';

export interface ABTestConfig {
  testId: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string | null;
  trafficAllocation: {
    control: number;  // Percentage (0-100)
    treatment: number;  // Percentage (0-100)
  };
  enabled: boolean;
}

// Current A/B test: Category Expansion Impact
export const CATEGORY_EXPANSION_TEST: ABTestConfig = {
  testId: 'category-expansion-2024',
  name: 'Category Expansion Impact Test',
  description: 'Compare recommendation quality before (30-95 careers/category) and after (95 careers/category) expansion',
  startDate: '2024-01-24',
  endDate: null,  // null = ongoing
  trafficAllocation: {
    control: 0,     // 0% = old algorithm (disabled - expansion complete)
    treatment: 100  // 100% = new algorithm with balanced categories
  },
  enabled: true
};

/**
 * Assigns a user to an A/B test variant
 * Uses deterministic hashing for consistency
 */
export function assignABTestVariant(
  userId: string,
  testConfig: ABTestConfig = CATEGORY_EXPANSION_TEST
): ABTestVariant {
  if (!testConfig.enabled) {
    return 'treatment';  // Default to treatment if test is disabled
  }

  // Simple hash function for deterministic assignment
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  const percentage = Math.abs(hash % 100);

  if (percentage < testConfig.trafficAllocation.control) {
    return 'control';
  } else {
    return 'treatment';
  }
}

/**
 * Gets the user's A/B test variant from localStorage or assigns a new one
 */
export function getOrAssignABTestVariant(): ABTestVariant {
  // Check if running in browser
  if (typeof window === 'undefined') {
    return 'treatment';
  }

  const STORAGE_KEY = 'ab_test_variant';
  const TEST_USER_ID_KEY = 'ab_test_user_id';

  // Check for existing variant
  const existingVariant = safeGetString(STORAGE_KEY) as ABTestVariant | null;
  if (existingVariant && (existingVariant === 'control' || existingVariant === 'treatment')) {
    return existingVariant;
  }

  // Get or create a unique user ID for this session
  let userId = safeGetString(TEST_USER_ID_KEY);
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    safeSetString(TEST_USER_ID_KEY, userId);
  }

  // Assign variant
  const variant = assignABTestVariant(userId, CATEGORY_EXPANSION_TEST);

  // Store variant
  safeSetString(STORAGE_KEY, variant);

  return variant;
}

/**
 * Logs an A/B test event for analytics
 */
export interface ABTestEvent {
  testId: string;
  variant: ABTestVariant;
  eventType: 'impression' | 'interaction' | 'conversion';
  metadata?: Record<string, any>;
  timestamp: string;
}

export function logABTestEvent(
  eventType: ABTestEvent['eventType'],
  metadata?: Record<string, any>
): ABTestEvent {
  const variant = getOrAssignABTestVariant();

  const event: ABTestEvent = {
    testId: CATEGORY_EXPANSION_TEST.testId,
    variant,
    eventType,
    metadata,
    timestamp: new Date().toISOString()
  };

  // Log to console in development only
  if (process.env.NODE_ENV === 'development') {
    console.log('[A/B TEST EVENT]', event);
  }

  // In production, send to analytics service
  // NOTE: Analytics integration placeholder - implement when analytics service is configured
  // Supported services: Google Analytics 4, Mixpanel, Amplitude, PostHog
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    // Example: analytics.track('ab_test_event', event);
  }

  return event;
}

/**
 * Resets the A/B test assignment (for testing purposes only)
 */
export function resetABTestAssignment() {
  if (typeof window === 'undefined') return;

  safeRemoveItem('ab_test_variant');
  safeRemoveItem('ab_test_user_id');
}
