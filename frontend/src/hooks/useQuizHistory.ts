import { useState, useEffect, useCallback } from 'react';
import * as quizService from '../api/quizService';
import type { QuizResult } from '../types';

export function useQuizHistory() {
  const [history, setHistory] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await quizService.getQuizHistory();
      if (response.success && response.data) {
        setHistory(response.data);
      } else {
        setError(response.error?.message ?? 'Failed to load quiz history.');
      }
    } catch {
      setError('Failed to load quiz history. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { history, loading, error, refetch: fetchHistory };
}
