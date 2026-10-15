import React from 'react';

export function CircularScore({
  score = 72,
  max = 100,
  size = 110,
  strokeWidth = 10,
  showLabel = true,
  className = '',
}) {
  const normalizedScore = Math.min(max, Math.max(0, score));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / max) * circumference;

  // Color selection based on score threshold
  let strokeColor = '#28785c'; // green default
  if (normalizedScore < 50) {
    strokeColor = '#d33838'; // red
  } else if (normalizedScore < 65) {
    strokeColor = '#e69d28'; // amber
  }

  return (
    <div
      className={`circular-score ${className}`}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={normalizedScore}
      aria-valuemin="0"
      aria-valuemax={max}
      aria-label={`Credit readiness score: ${normalizedScore} out of ${max}`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#edf0f4"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated Progress Indicator */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>

      {showLabel && (
        <div className="circular-score__content">
          <span className="circular-score__val">{normalizedScore}</span>
          <span className="circular-score__max">/ {max}</span>
        </div>
      )}
    </div>
  );
}
