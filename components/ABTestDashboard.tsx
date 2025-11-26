'use client';

/**
 * A/B TEST ANALYTICS DASHBOARD
 * Displays metrics comparing control vs treatment groups
 */

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

interface ABTestMetrics {
  variant: 'control' | 'treatment';
  totalUsers: number;
  avgRating: number;
  categoryDistribution: Record<string, number>;
  satisfactionRate: number;  // % of ratings >= 4
}

export function ABTestDashboard() {
  const [metrics, setMetrics] = useState<{
    control: ABTestMetrics | null;
    treatment: ABTestMetrics | null;
  }>({
    control: null,
    treatment: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      // Fetch feedback data from Supabase
      const { data, error } = await supabase
        .from('career_feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading metrics:', error);
        setLoading(false);
        return;
      }

      // Process metrics for control and treatment groups
      // Note: In the current implementation, all users are in treatment group
      // This is prepared for when you want to run actual A/B tests

      const treatmentData = data || [];

      const treatmentMetrics: ABTestMetrics = {
        variant: 'treatment',
        totalUsers: treatmentData.length,
        avgRating: treatmentData.length > 0
          ? treatmentData.reduce((sum: number, row: { rating: number }) => sum + row.rating, 0) / treatmentData.length
          : 0,
        categoryDistribution: calculateCategoryDistribution(treatmentData),
        satisfactionRate: treatmentData.length > 0
          ? (treatmentData.filter((row: { rating: number }) => row.rating >= 4).length / treatmentData.length) * 100
          : 0
      };

      setMetrics({
        control: null,  // No control group data yet
        treatment: treatmentMetrics
      });
      setLoading(false);
    } catch (err) {
      console.error('Error in loadMetrics:', err);
      setLoading(false);
    }
  };

  const calculateCategoryDistribution = (data: any[]): Record<string, number> => {
    const distribution: Record<string, number> = {};
    let total = 0;

    data.forEach(row => {
      if (row.category_distribution) {
        Object.entries(row.category_distribution as Record<string, number>).forEach(([category, count]) => {
          distribution[category] = (distribution[category] || 0) + (count as number);
          total += count as number;
        });
      }
    });

    // Convert to percentages
    const percentages: Record<string, number> = {};
    Object.entries(distribution).forEach(([category, count]) => {
      percentages[category] = total > 0 ? Math.round((count / total) * 100) : 0;
    });

    return percentages;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">Loading metrics...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Category Expansion Impact - Analytics</CardTitle>
          <CardDescription>
            Tracking recommendation quality after expanding all categories to 95 careers
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Treatment Group Metrics */}
      {metrics.treatment && (
        <Card>
          <CardHeader>
            <CardTitle>Current System (Balanced Categories)</CardTitle>
            <CardDescription>All categories have 95 careers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">
                  {metrics.treatment.totalUsers}
                </p>
                <p className="text-sm text-gray-600">Total Feedback</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">
                  {metrics.treatment.avgRating.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Avg Rating (1-5)</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-3xl font-bold text-purple-600">
                  {metrics.treatment.satisfactionRate.toFixed(0)}%
                </p>
                <p className="text-sm text-gray-600">Satisfaction Rate</p>
              </div>
            </div>

            {/* Category Distribution */}
            <div>
              <h4 className="font-semibold mb-3">Category Distribution</h4>
              <div className="space-y-2">
                {Object.entries(metrics.treatment.categoryDistribution)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, percentage]) => (
                    <div key={category} className="flex items-center gap-3">
                      <div className="w-32 text-sm text-gray-600 capitalize">
                        {category.replace(/-/g, ' ')}
                      </div>
                      <div className="flex-1">
                        <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                      <div className="w-12 text-sm font-semibold text-right">
                        {percentage}%
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Goal: Balanced Distribution */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Goal:</strong> With 95 careers in each category, we expect a more balanced distribution
                compared to the previous 77% &quot;auttaja&quot; dominance.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Historical Comparison (if control data exists) */}
      {metrics.control && (
        <Card>
          <CardHeader>
            <CardTitle>Previous System (Imbalanced Categories)</CardTitle>
            <CardDescription>Before expansion (30-95 careers per category)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-gray-600">
                  {metrics.control.totalUsers}
                </p>
                <p className="text-sm text-gray-600">Total Feedback</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-gray-600">
                  {metrics.control.avgRating.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Avg Rating (1-5)</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-gray-600">
                  {metrics.control.satisfactionRate.toFixed(0)}%
                </p>
                <p className="text-sm text-gray-600">Satisfaction Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No data message */}
      {!metrics.treatment?.totalUsers && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">
              No feedback data yet. Users need to complete the career test and submit feedback.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
