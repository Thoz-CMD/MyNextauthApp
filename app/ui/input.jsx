"use client";
import { useId } from 'react';

export function Input({ label, error, helperText, className = '', id, type = 'text', ...rest }) {
  const reactId = useId();
  const inputId = id || reactId;
  return (
    <div className="space-y-1 w-full">
      {label && <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-200">{label}</label>}
      <input
        id={inputId}
        type={type}
        className={`w-full rounded-md border px-3 py-2 text-sm bg-white dark:bg-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 dark:placeholder-gray-500 ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} ${className}`}
        aria-invalid={!!error}
        aria-describedby={helperText ? `${inputId}-helper` : undefined}
        {...rest}
      />
      {error && <p className="text-xs text-red-600" role="alert">{error}</p>}
      {!error && helperText && <p id={`${inputId}-helper`} className="text-xs text-gray-500 dark:text-gray-400">{helperText}</p>}
    </div>
  );
}
