"use client";

const variantClasses = {
  primary: "bg-blue-600 text-white hover:bg-blue-500 focus:ring-blue-500",
  secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400",
  outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
  danger: "bg-red-600 text-white hover:bg-red-500 focus:ring-red-500",
  ghost: "hover:bg-gray-100 text-gray-700 focus:ring-gray-300 dark:hover:bg-gray-800 dark:text-gray-200 dark:focus:ring-gray-600"
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-3 text-base"
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  leftIcon = null,
  rightIcon = null,
  ...rest
}) {
  return (
    <button
      className={`inline-flex items-center justify-center font-medium rounded-md transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${loading ? 'opacity-80 cursor-wait' : ''} ${className}`}
      {...rest}
    >
      {loading && (
        <span className="mr-2 h-4 w-4 animate-spin border-2 border-white/40 border-t-white rounded-full" />
      )}
      {leftIcon && <span className="mr-2 flex items-center">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2 flex items-center">{rightIcon}</span>}
    </button>
  );
}
