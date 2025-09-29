"use client";

const typeMap = {
  info:   { base: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800' },
  success:{ base: 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-200 dark:border-green-800' },
  error:  { base: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-800' },
  warn:   { base: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800' }
};

export function Alert({ type='info', title, children, className='' }) {
  const cls = typeMap[type] || typeMap.info;
  return (
    <div className={`rounded-md border px-4 py-3 text-sm ${cls.base} ${className}`} role="alert">
      {title && <div className="font-semibold mb-1">{title}</div>}
      {children}
    </div>
  );
}
