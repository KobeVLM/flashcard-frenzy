import client from './client';
import type { ApiResponse, AdminStats, AdminUser } from '../types';

export async function getAdminStats(): Promise<ApiResponse<AdminStats>> {
  const response = await client.get<ApiResponse<AdminStats>>('/admin/stats');
  return response.data;
}

export async function getAdminUsers(): Promise<ApiResponse<AdminUser[]>> {
  const response = await client.get<ApiResponse<AdminUser[]>>('/admin/users');
  return response.data;
}

export async function updateAdminUser(
  id: string,
  payload: { active?: boolean; role?: string }
): Promise<ApiResponse<AdminUser>> {
  const response = await client.patch<ApiResponse<AdminUser>>(`/admin/users/${id}`, payload);
  return response.data;
}

export async function deleteAdminUser(id: string): Promise<ApiResponse<null>> {
  const response = await client.delete<ApiResponse<null>>(`/admin/users/${id}`);
  return response.data;
}
