import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/errorMessages';
import { AxiosError } from 'axios';
import type { ApiResponse } from '../api/authService';

// ─── Validation helpers ───────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FieldErrors {
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

function validateRegister(
    email: string,
    password: string,
    confirmPassword: string
): FieldErrors {
    const errors: FieldErrors = {};

    if (!email.trim()) {
        errors.email = 'Email is required.';
    } else if (!EMAIL_REGEX.test(email)) {
        errors.email = 'Please enter a valid email address.';
    }

    if (!password) {
        errors.password = 'Password is required.';
    } else if (password.length < 8) {
        errors.password = 'Password must be at least 8 characters.';
    }

    if (!confirmPassword) {
        errors.confirmPassword = 'Please confirm your password.';
    } else if (password && confirmPassword !== password) {
        errors.confirmPassword = 'Passwords do not match.';
    }

    return errors;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [apiError, setApiError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError(null);

        // Client-side validation (VALID-001)
        const errors = validateRegister(email, password, confirmPassword);
        setFieldErrors(errors);
        if (Object.keys(errors).length > 0) return;

        setLoading(true);
        try {
            const response = await register(fullName, email, password, confirmPassword);
            if (response.success) {
                navigate('/dashboard', { replace: true });
            } else {
                const code = response.error?.code;
                setApiError(getErrorMessage(code));
            }
        } catch (err) {
            const axiosErr = err as AxiosError<ApiResponse>;
            const code = axiosErr.response?.data?.error?.code;
            setApiError(getErrorMessage(code));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-12">
            {/* Decorative blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo / Brand */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">
                        ⚡ <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Flashcard Frenzy</span>
                    </h1>
                    <p className="mt-2 text-slate-400 text-sm">Create your account to start learning</p>
                </div>

                {/* Card */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-8">
                    {/* API error banner */}
                    {apiError && (
                        <div className="mb-5 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-red-300 text-sm flex items-center gap-2 animate-[fadeIn_0.2s_ease-out]">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {apiError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate className="space-y-5">
                        {/* Full Name (optional) */}
                        <div>
                            <label htmlFor="register-fullname" className="block text-sm font-medium text-slate-300 mb-1.5">
                                Full name <span className="text-slate-500">(optional)</span>
                            </label>
                            <input
                                id="register-fullname"
                                type="text"
                                autoComplete="name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                                placeholder="John Doe"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="register-email" className="block text-sm font-medium text-slate-300 mb-1.5">
                                Email address
                            </label>
                            <input
                                id="register-email"
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full rounded-lg bg-white/5 border ${fieldErrors.email ? 'border-red-500' : 'border-white/10'
                                    } px-4 py-3 text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30`}
                                placeholder="you@example.com"
                            />
                            {fieldErrors.email && (
                                <p className="mt-1.5 text-sm text-red-400 animate-[fadeIn_0.2s_ease-out]">
                                    {fieldErrors.email}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="register-password" className="block text-sm font-medium text-slate-300 mb-1.5">
                                Password
                            </label>
                            <input
                                id="register-password"
                                type="password"
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full rounded-lg bg-white/5 border ${fieldErrors.password ? 'border-red-500' : 'border-white/10'
                                    } px-4 py-3 text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30`}
                                placeholder="••••••••"
                            />
                            {fieldErrors.password && (
                                <p className="mt-1.5 text-sm text-red-400 animate-[fadeIn_0.2s_ease-out]">
                                    {fieldErrors.password}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="register-confirm-password" className="block text-sm font-medium text-slate-300 mb-1.5">
                                Confirm password
                            </label>
                            <input
                                id="register-confirm-password"
                                type="password"
                                autoComplete="new-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`w-full rounded-lg bg-white/5 border ${fieldErrors.confirmPassword ? 'border-red-500' : 'border-white/10'
                                    } px-4 py-3 text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30`}
                                placeholder="••••••••"
                            />
                            {fieldErrors.confirmPassword && (
                                <p className="mt-1.5 text-sm text-red-400 animate-[fadeIn_0.2s_ease-out]">
                                    {fieldErrors.confirmPassword}
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            id="register-submit"
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Creating account…
                                </span>
                            ) : (
                                'Create account'
                            )}
                        </button>
                    </form>

                    {/* Login link */}
                    <p className="mt-6 text-center text-sm text-slate-400">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
