import { useState, useEffect, useCallback } from 'react';
import * as deckService from '../api/deckService';
import type { Deck } from '../types';

export function useDeck(id: string) {
  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeck = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await deckService.getDeck(id);
      if (response.success && response.data) {
        setDeck(response.data);
      } else {
        setError(response.error?.message ?? 'Failed to load deck.');
      }
    } catch {
      setError('Failed to load deck. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchDeck();
  }, [id, fetchDeck]);

  return { deck, loading, error, refetch: fetchDeck };
}
