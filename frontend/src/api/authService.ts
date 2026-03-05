import api from './axios';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
    success: boolean;
    data: T | null;
    error: {
        code: string;
        message: string;
        details: Record<string, string> | null;
    } | null;
    timestamp: string;
}

export interface AuthData {
    token: string;
    user: {
        id: number;
        email: string;
        fullName: string;
        role: string;
    };
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export async function login(payload: LoginPayload): Promise<ApiResponse<AuthData>> {
    const response = await api.post<ApiResponse<AuthData>>('/auth/login', payload);
    return response.data;
}

export async function register(payload: RegisterPayload): Promise<ApiResponse<AuthData>> {
    const response = await api.post<ApiResponse<AuthData>>('/auth/register', payload);
    return response.data;
}
