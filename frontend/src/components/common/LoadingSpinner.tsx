interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner = ({ size = 'md', className = '' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-10 w-10 border-3',
    lg: 'h-14 w-14 border-4',
  };

  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className="flex flex-col items-center">
        <div className={`animate-spin rounded-full border-slate-200 border-t-slate-900 ${sizeClasses[size]}`}></div>
        <p className="mt-4 text-sm text-slate-500 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
