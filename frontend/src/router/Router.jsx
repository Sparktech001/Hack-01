import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const RouterContext = createContext(null);

export function RouterProvider({ children, initialPath = '/welcome' }) {
  // Read path from browser location if valid, or default to initialPath
  const getInitialPath = () => {
    const current = window.location.pathname;
    return current && current !== '/' ? current : initialPath;
  };

  const [currentPath, setCurrentPath] = useState(getInitialPath);
  const [routeState, setRouteState] = useState(null);

  const navigate = useCallback((to, state = null) => {
    if (to !== window.location.pathname) {
      window.history.pushState(state, '', to);
    }
    setCurrentPath(to);
    setRouteState(state);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handlePopState = (event) => {
      setCurrentPath(window.location.pathname || initialPath);
      setRouteState(event.state || null);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [initialPath]);

  return (
    <RouterContext.Provider value={{ currentPath, navigate, routeState }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}

export function Link({ to, children, className = '', state = null, ...props }) {
  const { navigate } = useRouter();

  const handleClick = (e) => {
    e.preventDefault();
    navigate(to, state);
  };

  return (
    <a href={to} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
}
