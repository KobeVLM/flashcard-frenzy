import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-3xl mb-6 shadow-lg shadow-indigo-500/30">
                    🎓
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Welcome to Dashboard</h1>
                {user && (
                    <p className="text-slate-400 mb-8">
                        Logged in as <span className="text-indigo-400 font-medium">{user.email}</span>
                    </p>
                )}
                <button
                    onClick={handleLogout}
                    className="px-6 py-2.5 rounded-lg text-sm font-medium text-slate-300 border border-white/10 hover:bg-white/5 transition-all duration-200"
                >
                    Sign out
                </button>
            </div>
        </div>
    );
}
