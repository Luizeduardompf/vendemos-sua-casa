interface FieldErrorProps {
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function FieldError({ error, children, className = "" }: FieldErrorProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {children}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
