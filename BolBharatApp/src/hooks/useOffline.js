import { useState, useEffect } from 'react';
import offlineManager from '../utils/offlineManager';

/**
 * Hook to monitor network connectivity status
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      const status = await offlineManager.initialize();
      if (mounted) {
        setIsOnline(status);
        setIsInitialized(true);
      }
    };

    initialize();

    // Subscribe to connectivity changes
    const unsubscribe = offlineManager.addListener((online) => {
      if (mounted) {
        setIsOnline(online);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  return { isOnline, isInitialized };
};

/**
 * Hook to get offline queue status
 */
export const useOfflineQueue = () => {
  const [queueStatus, setQueueStatus] = useState({
    count: 0,
    items: [],
  });
  const [syncInProgress, setSyncInProgress] = useState(false);

  const refreshStatus = () => {
    const status = offlineManager.getQueueStatus();
    setQueueStatus(status);
  };

  const syncQueue = async () => {
    setSyncInProgress(true);
    try {
      await offlineManager.syncQueue();
      refreshStatus();
    } catch (error) {
      console.error('Error syncing queue:', error);
    } finally {
      setSyncInProgress(false);
    }
  };

  const clearQueue = async () => {
    await offlineManager.clearQueue();
    refreshStatus();
  };

  useEffect(() => {
    refreshStatus();
    
    // Refresh every 5 seconds
    const interval = setInterval(refreshStatus, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    queueStatus,
    syncInProgress,
    syncQueue,
    clearQueue,
    refreshStatus,
  };
};

/**
 * Hook to get cache status
 */
export const useOfflineCache = () => {
  const [cacheStatus, setCacheStatus] = useState({
    count: 0,
    sizeBytes: 0,
    sizeKB: '0.00',
  });

  const refreshStatus = () => {
    const status = offlineManager.getCacheStatus();
    setCacheStatus(status);
  };

  const clearCache = async () => {
    await offlineManager.clearCache();
    refreshStatus();
  };

  useEffect(() => {
    refreshStatus();
    
    // Refresh every 10 seconds
    const interval = setInterval(refreshStatus, 10000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    cacheStatus,
    clearCache,
    refreshStatus,
  };
};

/**
 * Hook for making offline-aware API requests
 */
export const useOfflineRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [fromCache, setFromCache] = useState(false);

  const makeRequest = async (url, options = {}) => {
    setLoading(true);
    setError(null);
    setFromCache(false);

    try {
      const result = await offlineManager.fetch(url, options);
      setData(result.data);
      setFromCache(result.fromCache);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setData(null);
    setFromCache(false);
  };

  return {
    loading,
    error,
    data,
    fromCache,
    makeRequest,
    reset,
  };
};
