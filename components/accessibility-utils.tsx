import { ReactNode } from 'react';

interface AccessibleCardProps {
  children: ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export function AccessibleCard({ children, title, description, className = "" }: AccessibleCardProps) {
  return (
    <div 
      className={`rounded-xl border bg-card text-card-foreground shadow transition-colors ${className}`}
      role="region"
      aria-labelledby={`card-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
      tabIndex={0}
    >
      <div className="p-6">
        <h3 
          id={`card-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
          className="text-xl font-semibold leading-none tracking-tight mb-2"
        >
          {title}
        </h3>
        {description && (
          <p 
            id={`card-description-${title.replace(/\s+/g, '-').toLowerCase()}`}
            className="text-sm text-muted-foreground mb-4"
            aria-hidden="false"
          >
            {description}
          </p>
        )}
        <div 
          aria-labelledby={description 
            ? `card-description-${title.replace(/\s+/g, '-').toLowerCase()}` 
            : `card-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

interface AccessibleButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  ariaLabel: string;
  disabled?: boolean;
}

export function AccessibleButton({ 
  children, 
  onClick, 
  variant = 'default', 
  size = 'default', 
  className = "", 
  ariaLabel,
  disabled = false
}: AccessibleButtonProps) {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "underline-offset-4 hover:underline text-primary"
  };
  
  const sizeClasses = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
    icon: "h-10 w-10"
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      {children}
    </button>
  );
}