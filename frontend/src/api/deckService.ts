import client from './client';
import type { ApiResponse, Deck, CreateDeckPayload, UpdateDeckPayload } from '../types';

export async function getDecks(search?: string): Promise<ApiResponse<Deck[]>> {
  const params: Record<string, string> = {};
  if (search) params.search = search;
  const response = await client.get<ApiResponse<Deck[]>>('/decks', { params });
  return response.data;
}

export async function getDeck(id: string): Promise<ApiResponse<Deck>> {
  const response = await client.get<ApiResponse<Deck>>(`/decks/${id}`);
  return response.data;
}

export async function createDeck(payload: CreateDeckPayload): Promise<ApiResponse<Deck>> {
  const response = await client.post<ApiResponse<Deck>>('/decks', payload);
  return response.data;
}

export async function updateDeck(id: string, payload: UpdateDeckPayload): Promise<ApiResponse<Deck>> {
  const response = await client.patch<ApiResponse<Deck>>(`/decks/${id}`, payload);
  return response.data;
}

export async function deleteDeck(id: string): Promise<ApiResponse<null>> {
  const response = await client.delete<ApiResponse<null>>(`/decks/${id}`);
  return response.data;
}
