export function Header({
  title,
  showBack = true,
  onBack,
  rightAction,
  dark = false,
  className = '',
}) {

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  return (
    <header className={`app-header ${dark ? 'app-header--dark' : ''} ${className}`}>
      <div className="app-header__left">
        {showBack && (
          <button
            type="button"
            className="app-header__back-btn"
            onClick={handleBack}
            aria-label="Go back"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}
      </div>

      <div className="app-header__title">
        {title && <h1>{title}</h1>}
      </div>

      <div className="app-header__right">
        {rightAction}
      </div>
    </header>
  );
}
