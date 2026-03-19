import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
  subtitle?: string;
  className?: string;
}

export function StatCard({ label, value, icon, subtitle, className = '' }: StatCardProps) {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 p-5 ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-gray-400">{subtitle}</p>}
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
            <span className="material-icons text-indigo-600">{icon}</span>
          </div>
        )}
      </div>
    </div>
  );
}
