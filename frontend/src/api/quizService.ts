import client from './client';
import type { ApiResponse, QuizResult, SubmitQuizPayload } from '../types';

export async function submitQuizResult(payload: SubmitQuizPayload): Promise<ApiResponse<QuizResult>> {
  const response = await client.post<ApiResponse<QuizResult>>('/quizzes/results', payload);
  return response.data;
}

export async function getQuizHistory(): Promise<ApiResponse<QuizResult[]>> {
  const response = await client.get<ApiResponse<QuizResult[]>>('/quizzes/history');
  return response.data;
}
