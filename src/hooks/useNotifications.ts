import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface NotificationData {
  count: number;
}

/**
 * Hook pour gérer les notifications admin
 * Récupère le nombre de notifications non lues via polling
 */
export const useNotifications = () => {
  const { user, isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchUnreadCount = useCallback(async () => {
    // Seulement pour les admins
    if (!isAuthenticated || user?.role !== 'admin') {
      setUnreadCount(0);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      
      if (!token) {
        setUnreadCount(0);
        return;
      }

      const response = await fetch('http://localhost:5000/api/notifications/unread-count', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        const data: NotificationData = await response.json();
        setUnreadCount(data.count || 0);
      } else {
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error fetching notification count:', error);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.role]);

  useEffect(() => {
    // Fetch initial
    fetchUnreadCount();

    // Seulement activer le polling pour les admins
    if (isAuthenticated && user?.role === 'admin') {
      // Polling toutes les 30 secondes
      const interval = setInterval(fetchUnreadCount, 30000);
      
      return () => clearInterval(interval);
    }
  }, [fetchUnreadCount, isAuthenticated, user?.role]);

  return { 
    unreadCount, 
    loading,
    refresh: fetchUnreadCount 
  };
};
