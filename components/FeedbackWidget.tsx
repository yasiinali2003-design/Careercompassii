'use client';

/**
 * FEEDBACK WIDGET COMPONENT
 * Collects user feedback on career recommendation quality
 * Tracks category distribution and user satisfaction
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

interface FeedbackWidgetProps {
  cohort: string;
  dominantCategory: string;
  recommendedCareers: Array<{
    slug: string;
    title: string;
    category: string;
    overallScore: number;
  }>;
}

export function FeedbackWidget({ cohort, dominantCategory, recommendedCareers }: FeedbackWidgetProps) {
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  const handleSubmitFeedback = async () => {
    if (selectedRating === null) return;

    setIsSubmitting(true);

    try {
      // Check if supabase client is available
      if (!supabase) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Supabase client not available');
        }
        setFeedbackSubmitted(true);
        return;
      }

      // Log feedback to Supabase
      const { error } = await supabase.from('career_feedback').insert({
        cohort,
        dominant_category: dominantCategory,
        rating: selectedRating,
        feedback_text: feedbackText || null,
        recommended_careers: recommendedCareers.map(c => c.slug),
        category_distribution: recommendedCareers.reduce((acc, career) => {
          acc[career.category] = (acc[career.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        created_at: new Date().toISOString(),
      });

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error submitting feedback:', error);
        }
      } else {
        setFeedbackSubmitted(true);

        // Log to console for visibility in development only
        if (process.env.NODE_ENV === 'development') {
          console.log('[FEEDBACK] User Rating:', selectedRating);
          console.log('[FEEDBACK] Dominant Category:', dominantCategory);
          console.log('[FEEDBACK] Career Distribution:', recommendedCareers.reduce((acc, career) => {
            acc[career.category] = (acc[career.category] || 0) + 1;
            return acc;
          }, {} as Record<string, number>));
        }
      }
    } catch {
      // Silently fail in production, log in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Error submitting feedback');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (feedbackSubmitted) {
    return (
      <Card className="mt-6 bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <p className="text-center text-green-800">
            ✅ Kiitos palautteestasi! Se auttaa meitä parantamaan suosituksia.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Kuinka hyödyllisiä suositukset olivat?</CardTitle>
        <CardDescription>
          Palautteesi auttaa meitä parantamaan urasuositusten laatua
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Rating Scale */}
        <div className="flex flex-col items-center space-y-2">
          <p className="text-sm text-neutral-300">Arvostele suositukset:</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Button
                key={rating}
                variant={selectedRating === rating ? 'primary' : 'outline'}
                size="lg"
                onClick={() => setSelectedRating(rating)}
                className="w-12 h-12"
              >
                {rating}
              </Button>
            ))}
          </div>
          <div className="flex justify-between w-full text-xs text-neutral-400 px-2">
            <span>Ei lainkaan hyödyllinen</span>
            <span>Erittäin hyödyllinen</span>
          </div>
        </div>

        {/* Optional Text Feedback */}
        <div className="space-y-2">
          <label htmlFor="feedback-text" className="text-sm font-medium">
            Vapaaehtoinen palaute (valinnainen):
          </label>
          <textarea
            id="feedback-text"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Kerro meille miten voimme parantaa suosituksia..."
            className="w-full min-h-[80px] p-2 border rounded-md resize-none focus:ring-2 focus:ring-blue-500"
            maxLength={500}
          />
          <p className="text-xs text-neutral-400">
            {feedbackText.length}/500 merkkiä
          </p>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmitFeedback}
          disabled={selectedRating === null || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Lähetetään...' : 'Lähetä palaute'}
        </Button>

        {/* Debug Info (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-neutral-800/30 rounded text-xs">
            <p className="font-semibold mb-1">Debug Info:</p>
            <p>Dominant Category: {dominantCategory}</p>
            <p>Cohort: {cohort}</p>
            <p>Recommended: {recommendedCareers.length} careers</p>
            <p>Categories: {Array.from(new Set(recommendedCareers.map(c => c.category))).join(', ')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
