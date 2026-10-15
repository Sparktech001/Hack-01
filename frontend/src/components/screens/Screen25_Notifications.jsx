import React, { useState, useEffect } from 'react';
import { useRouter } from '../../router/Router.jsx';
import { useAppState } from '../../context/AppStateContext.jsx';
import { notificationService } from '../../api/notifications.js';
import { Header } from '../common/Header.jsx';
import { Button } from '../common/Button.jsx';

export function Screen25_Notifications() {
  const { navigate } = useRouter();
  const { setUnreadNotificationsCount } = useAppState();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    notificationService.getNotifications().then((data) => {
      if (isMounted) {
        setNotifications(data);
        setLoading(false);
      }
    }).catch((err) => {
      console.error(err);
      if (isMounted) setLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    const updated = await notificationService.markAllAsRead();
    setNotifications(updated);
    setUnreadNotificationsCount(0);
  };

  const handleClearAll = async () => {
    const updated = await notificationService.clearAll();
    setNotifications(updated);
    setUnreadNotificationsCount(0);
  };

  return (
    <div className="screen screen--notifications">
      <Header
        title="Notifications"
        showBack
        onBack={() => navigate('/home')}
        rightAction={
          notifications.length > 0 && (
            <button
              type="button"
              className="notif-header-action"
              onClick={handleMarkAllRead}
            >
              Mark all read
            </button>
          )
        }
      />

      <div className="notifications-card">
        {loading ? (
          <div className="tx-loading">
            <span className="btn__spinner" />
            <p className="text-secondary text-sm mt-2">Checking notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          /* Empty State matching row 5 screen 25 */
          <div className="notif-empty-state">
            <div className="notif-empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#8c9ba8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <h3 className="notif-empty-title">All caught up!</h3>
            <p className="notif-empty-desc">
              You have no new notifications or pending reminders at this time.
            </p>
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadNotifications()}
              >
                Refresh
              </Button>
            </div>
          </div>
        ) : (
          <div className="notif-list">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`notif-item ${!n.read ? 'notif-item--unread' : ''}`}
              >
                <div className="notif-item__icon">
                  {n.type === 'pool' && '🤝'}
                  {n.type === 'verification' && '🛡️'}
                  {n.type === 'reminder' && '⏰'}
                </div>

                <div className="notif-item__body">
                  <div className="notif-item__top">
                    <span className="notif-item__title">{n.title}</span>
                    <span className="notif-item__date">{n.date}</span>
                  </div>
                  <p className="notif-item__message">{n.message}</p>
                </div>
              </div>
            ))}

            <div className="notif-clear-section mt-4">
              <button
                type="button"
                className="notif-clear-btn"
                onClick={handleClearAll}
              >
                Clear all notifications
              </button>
            </div>
          </div>
        )}

        <div className="demo-disclaimer-box mt-4">
          <small>Simulated student activity notifications for prototype review.</small>
        </div>
      </div>
    </div>
  );
}
