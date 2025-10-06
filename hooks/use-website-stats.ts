'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface WebsiteStat {
  id: string;
  metric_name: string;
  metric_value: number;
  metric_type: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export function useWebsiteStats() {
  const [stats, setStats] = useState<WebsiteStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('website_stats')
      .select('*')
      .order('metric_name');

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setStats(data || []);
    }
    setLoading(false);
  };

  const getStatByName = (name: string): number => {
    const stat = stats.find(s => s.metric_name === name);
    return stat ? stat.metric_value : 0;
  };

  const getStatsByType = (type: string): WebsiteStat[] => {
    return stats.filter(s => s.metric_type === type);
  };

  return {
    stats,
    loading,
    error,
    getStatByName,
    getStatsByType,
    reload: loadStats,
  };
}
