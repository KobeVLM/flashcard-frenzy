import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/errorMessages';

type FormMode = 'login' | 'register';

export default function LoginPage() {
  const [mode, setMode] = useState<FormMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setConfirmPassword('');
    setError('');
    setFieldErrors({});
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setLoading(true);

    try {
      if (mode === 'login') {
        const response = await login(email, password);
        if (response.success) {
          navigate('/dashboard');
        } else {
          const code = response.error?.code;
          if (code === 'VALID-001' && typeof response.error?.details === 'object' && response.error.details) {
            setFieldErrors(response.error.details as Record<string, string>);
          } else {
            setError(getErrorMessage(code));
          }
        }
      } else {
        if (password !== confirmPassword) {
          setFieldErrors({ confirmPassword: 'Passwords do not match.' });
          setLoading(false);
          return;
        }
        const response = await register(firstName, lastName, email, password, confirmPassword);
        if (response.success) {
          navigate('/dashboard');
        } else {
          const code = response.error?.code;
          if (code === 'VALID-001' && typeof response.error?.details === 'object' && response.error.details) {
            setFieldErrors(response.error.details as Record<string, string>);
          } else {
            setError(getErrorMessage(code));
          }
        }
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: { code?: string; details?: Record<string, string> } } } };
      const code = axiosError?.response?.data?.error?.code;
      if (code === 'VALID-001' && axiosError?.response?.data?.error?.details) {
        setFieldErrors(axiosError.response.data.error.details);
      } else {
        setError(getErrorMessage(code));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 text-white flex-col justify-center px-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-indigo-500 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-purple-500 blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
              <span className="material-icons text-white">style</span>
            </div>
            <span className="text-xl font-bold">Flashcard Frenzy</span>
          </div>
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            Master your studies,<br />one card at a time.
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed max-w-md">
            Create, study, and test yourself with smart flashcards. Track your progress and build lasting knowledge.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-sm">
            <div>
              <p className="text-2xl font-bold text-indigo-400">10K+</p>
              <p className="text-xs text-gray-500 mt-1">Active Learners</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-indigo-400">500K+</p>
              <p className="text-xs text-gray-500 mt-1">Cards Created</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-indigo-400">95%</p>
              <p className="text-xs text-gray-500 mt-1">Retention Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
              <span className="material-icons text-white">style</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Flashcard Frenzy</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-500 mb-8">
            {mode === 'login'
              ? 'Master your studies, one card at a time.'
              : 'Start your learning journey today.'}
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <span className="material-icons text-sm">error</span>
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'register' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    required
                    className={`w-full px-4 py-3 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                      fieldErrors.firstName ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                  {fieldErrors.firstName && (
                    <p className="mt-1 text-xs text-red-500">{fieldErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    required
                    className={`w-full px-4 py-3 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                      fieldErrors.lastName ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                  {fieldErrors.lastName && (
                    <p className="mt-1 text-xs text-red-500">{fieldErrors.lastName}</p>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className={`w-full px-4 py-3 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                  fieldErrors.email ? 'border-red-300' : 'border-gray-200'
                }`}
              />
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'login' ? 'Enter your password' : 'Minimum 8 characters'}
                  required
                  minLength={8}
                  className={`w-full px-4 py-3 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition pr-12 ${
                    fieldErrors.password ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <span className="material-icons text-xl">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>
              )}
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  required
                  minLength={8}
                  className={`w-full px-4 py-3 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                    fieldErrors.confirmPassword ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">{fieldErrors.confirmPassword}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              )}
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={toggleMode}
              className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
            >
              {mode === 'login' ? 'Sign up for free' : 'Log in here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
