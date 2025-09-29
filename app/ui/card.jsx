"use client";

export function Card({ children, className="", padded=true }) {
  return (
    <div className={`rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm ${padded ? 'p-6' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className="" }) {
  return <h2 className={`text-lg font-semibold tracking-tight mb-4 ${className}`}>{children}</h2>;
}

export function CardFooter({ children, className="" }) {
  return <div className={`mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 ${className}`}>{children}</div>;
}
