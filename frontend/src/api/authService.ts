import client from './client';
import type { ApiResponse, AuthData, LoginPayload, RegisterPayload } from '../types';

export async function login(payload: LoginPayload): Promise<ApiResponse<AuthData>> {
  const response = await client.post<ApiResponse<AuthData>>('/auth/login', payload);
  return response.data;
}

export async function register(payload: RegisterPayload): Promise<ApiResponse<AuthData>> {
  const response = await client.post<ApiResponse<AuthData>>('/auth/register', payload);
  return response.data;
}

export async function refreshToken(token: string): Promise<ApiResponse<AuthData>> {
  const response = await client.post<ApiResponse<AuthData>>('/auth/refresh', { refreshToken: token });
  return response.data;
}

export async function logout(): Promise<void> {
  await client.post('/auth/logout');
}
