import React from 'react';

export function StatusBar({ light = false }) {
  return (
    <div className={`status-bar ${light ? 'status-bar--light' : 'status-bar--dark'}`}>
      <span className="status-bar__time">9:41</span>
      <div className="status-bar__icons">
        {/* Cellular Signal Icon */}
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
          <rect x="0" y="8" width="3" height="3" rx="0.5" />
          <rect x="4.5" y="5.5" width="3" height="5.5" rx="0.5" />
          <rect x="9" y="3" width="3" height="8" rx="0.5" />
          <rect x="13.5" y="0" width="3" height="11" rx="0.5" />
        </svg>
        {/* Wifi Icon */}
        <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor">
          <path d="M7.5 3C9.7 3 11.6 3.8 13.1 5.2L14.2 4.1C12.4 2.4 10.1 1.5 7.5 1.5C4.9 1.5 2.6 2.4 0.8 4.1L1.9 5.2C3.4 3.8 5.3 3 7.5 3Z" />
          <path d="M7.5 6C8.9 6 10.2 6.5 11.2 7.5L12.3 6.4C11 5.1 9.3 4.4 7.5 4.4C5.7 4.4 4 5.1 2.7 6.4L3.8 7.5C4.8 6.5 6.1 6 7.5 6Z" />
          <circle cx="7.5" cy="9.5" r="1.5" />
        </svg>
        {/* Battery Icon */}
        <svg width="24" height="11" viewBox="0 0 24 11" fill="currentColor">
          <rect x="0.5" y="0.5" width="20" height="10" rx="2.5" stroke="currentColor" fill="none" />
          <rect x="2" y="2" width="14" height="7" rx="1.5" />
          <path d="M22 3.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
