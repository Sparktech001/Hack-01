import React from 'react';

export function Badge({
  children,
  variant = 'default', // 'verified' | 'success' | 'warning' | 'danger' | 'demo' | 'neutral'
  size = 'sm', // 'sm' | 'md'
  icon,
  className = '',
}) {
  return (
    <span className={`badge badge--${variant} badge--${size} ${className}`}>
      {icon && <span className="badge__icon">{icon}</span>}
      {children}
    </span>
  );
}

export function VerifiedBadge({ label = 'Verified Student' }) {
  return (
    <Badge
      variant="verified"
      icon={
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      }
    >
      {label}
    </Badge>
  );
}

export function DemoBadge({ label = 'Demo Mode' }) {
  return (
    <Badge variant="demo" size="sm">
      {label}
    </Badge>
  );
}
