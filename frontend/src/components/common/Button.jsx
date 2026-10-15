import React from 'react';

export function Button({
  children,
  type = 'button',
  variant = 'primary-navy', // 'primary-navy' | 'primary-gold' | 'secondary' | 'outline' | 'danger' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  fullWidth = true,
  disabled = false,
  loading = false,
  onClick,
  className = '',
  icon,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`btn btn--${variant} btn--${size} ${fullWidth ? 'btn--full' : ''} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="btn__spinner" aria-label="Loading..." />
      ) : (
        <>
          {icon && <span className="btn__icon">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
}
