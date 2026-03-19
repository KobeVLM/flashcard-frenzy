import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <span className="material-icons text-red-500 text-2xl">error_outline</span>
      </div>
      <p className="text-gray-700 text-sm font-medium mb-4 text-center max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
