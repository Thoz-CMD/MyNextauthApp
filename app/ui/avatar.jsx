"use client";
import { useState } from 'react';

export function Avatar({ src, alt='', size=48, className='' }) {
  const [error, setError] = useState(false);
  const dimension = typeof size === 'number' ? size : 48;
  return (
    <div className={`inline-flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden ${className}`} style={{ width: dimension, height: dimension }}>
      {(!src || error) ? (
        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">?</span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="w-full h-full object-cover" onError={() => setError(true)} />
      )}
    </div>
  );
}
