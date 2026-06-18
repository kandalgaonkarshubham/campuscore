interface LoadingSpinnerProps {
  label?: string;
  className?: string;
}

export default function LoadingSpinner({
  label = 'Loading...',
  className = '',
}: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600"
        role="status"
        aria-label={label}
      />
      {label && <p className="text-sm text-slate-500">{label}</p>}
    </div>
  );
}
