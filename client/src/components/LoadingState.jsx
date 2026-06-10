export function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-gray-600 border-t-blue-500 rounded-full animate-spin`}
      />
    </div>
  );
}

export function LoadingOverlay({ message = 'Loading...' }) {
  return (
    <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex flex-col justify-center items-center z-50">
      <LoadingSpinner size="lg" className="mb-4" />
      <p className="text-gray-200 font-medium animate-pulse">{message}</p>
    </div>
  );
}
