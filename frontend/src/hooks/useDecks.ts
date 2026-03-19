import { useState, useEffect, useCallback } from 'react';
import * as deckService from '../api/deckService';
import type { Deck } from '../types';

export function useDecks() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDecks = useCallback(async (search?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deckService.getDecks(search);
      if (response.success && response.data) {
        setDecks(response.data);
      } else {
        setError(response.error?.message ?? 'Failed to load decks.');
      }
    } catch {
      setError('Failed to load decks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDecks();
  }, [fetchDecks]);

  return { decks, loading, error, refetch: fetchDecks };
}
