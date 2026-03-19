import client from './client';
import type { ApiResponse, Flashcard, CreateFlashcardPayload, UpdateFlashcardPayload } from '../types';

export async function getCards(deckId: string): Promise<ApiResponse<Flashcard[]>> {
  const response = await client.get<ApiResponse<Flashcard[]>>(`/decks/${deckId}/cards`);
  return response.data;
}

export async function createCard(deckId: string, payload: CreateFlashcardPayload): Promise<ApiResponse<Flashcard>> {
  const response = await client.post<ApiResponse<Flashcard>>(`/decks/${deckId}/cards`, payload);
  return response.data;
}

export async function updateCard(cardId: string, payload: UpdateFlashcardPayload): Promise<ApiResponse<Flashcard>> {
  const response = await client.patch<ApiResponse<Flashcard>>(`/cards/${cardId}`, payload);
  return response.data;
}

export async function deleteCard(cardId: string): Promise<ApiResponse<null>> {
  const response = await client.delete<ApiResponse<null>>(`/cards/${cardId}`);
  return response.data;
}
