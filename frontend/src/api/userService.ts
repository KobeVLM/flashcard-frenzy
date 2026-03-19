import client from './client';
import type { ApiResponse, User } from '../types';

export async function getProfile(): Promise<ApiResponse<User>> {
  const response = await client.get<ApiResponse<User>>('/auth/me');
  return response.data;
}

export async function updateProfile(payload: { firstName?: string; lastName?: string }): Promise<ApiResponse<User>> {
  const response = await client.patch<ApiResponse<User>>('/auth/me', payload);
  return response.data;
}

export async function changePassword(payload: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<ApiResponse<null>> {
  const response = await client.post<ApiResponse<null>>('/auth/change-password', payload);
  return response.data;
}

export async function uploadPhoto(file: File): Promise<ApiResponse<User>> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await client.post<ApiResponse<User>>('/auth/me/photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}
