import React from 'react';
import { useRouter } from '../../router/Router.jsx';

export function BottomNav() {
  const { currentPath, navigate } = useRouter();

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      path: '/home',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      id: 'pool',
      label: 'Pool',
      path: '/pool',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      id: 'borrow',
      label: 'Borrow',
      path: '/borrow',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
          <circle cx="16" cy="15" r="1" />
        </svg>
      ),
    },
    {
      id: 'ai-check',
      label: 'AI Check',
      path: '/ai-check',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
    {
      id: 'profile',
      label: 'Profile',
      path: '/profile',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
  ];

  const isCurrentActive = (itemPath) => {
    if (itemPath === '/home') {
      return currentPath === '/home';
    }
    return currentPath.startsWith(itemPath);
  };

  return (
    <nav className="bottom-nav" aria-label="Main Navigation">
      <div className="bottom-nav__container">
        {navItems.map((item) => {
          const active = isCurrentActive(item.path);
          return (
            <button
              key={item.id}
              type="button"
              className={`bottom-nav__item ${active ? 'bottom-nav__item--active' : ''}`}
              onClick={() => navigate(item.path)}
              aria-current={active ? 'page' : undefined}
            >
              <div className="bottom-nav__icon">{item.icon}</div>
              <span className="bottom-nav__label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
