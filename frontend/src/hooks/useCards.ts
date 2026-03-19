import { useState, useEffect, useCallback } from 'react';
import * as cardService from '../api/cardService';
import type { Flashcard } from '../types';

export function useCards(deckId: string) {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCards = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await cardService.getCards(deckId);
      if (response.success && response.data) {
        setCards(response.data);
      } else {
        setError(response.error?.message ?? 'Failed to load cards.');
      }
    } catch {
      setError('Failed to load cards. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [deckId]);

  useEffect(() => {
    if (deckId) fetchCards();
  }, [deckId, fetchCards]);

  return { cards, loading, error, refetch: fetchCards };
}
