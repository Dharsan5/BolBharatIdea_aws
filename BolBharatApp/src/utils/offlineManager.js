import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Offline Manager - Handles network connectivity, request queuing, and sync
 */

const QUEUE_STORAGE_KEY = '@offline_queue';
const CACHE_STORAGE_KEY = '@api_cache';
const MAX_QUEUE_SIZE = 100;
const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 2000; // 2 seconds

class OfflineManager {
  constructor() {
    this.isOnline = true;
    this.listeners = [];
    this.syncInProgress = false;
    this.queue = [];
    this.cache = {};
  }

  /**
   * Initialize the offline manager
   */
  async initialize() {
    // Load queue and cache from storage
    await this.loadQueue();
    await this.loadCache();

    // Set up network listener
    this.unsubscribe = NetInfo.addEventListener(state => {
      const wasOnline = this.isOnline;
      this.isOnline = state.isConnected && state.isInternetReachable !== false;

      // Notify listeners of connectivity change
      this.notifyListeners(this.isOnline);

      // If coming back online, sync queued requests
      if (!wasOnline && this.isOnline) {
        this.syncQueue();
      }
    });

    // Check initial connection state
    const state = await NetInfo.fetch();
    this.isOnline = state.isConnected && state.isInternetReachable !== false;

    return this.isOnline;
  }

  /**
   * Clean up resources
   */
  async cleanup() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    await this.saveQueue();
    await this.saveCache();
  }

  /**
   * Add a listener for connectivity changes
   */
  addListener(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Notify all listeners of connectivity change
   */
  notifyListeners(isOnline) {
    this.listeners.forEach(listener => {
      try {
        listener(isOnline);
      } catch (error) {
        console.error('Error in offline listener:', error);
      }
    });
  }

  /**
   * Get current online status
   */
  getStatus() {
    return this.isOnline;
  }

  /**
   * Load queue from AsyncStorage
   */
  async loadQueue() {
    try {
      const queueData = await AsyncStorage.getItem(QUEUE_STORAGE_KEY);
      if (queueData) {
        this.queue = JSON.parse(queueData);
        console.log(`Loaded ${this.queue.length} queued requests`);
      }
    } catch (error) {
      console.error('Error loading queue:', error);
      this.queue = [];
    }
  }

  /**
   * Save queue to AsyncStorage
   */
  async saveQueue() {
    try {
      await AsyncStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.error('Error saving queue:', error);
    }
  }

  /**
   * Load cache from AsyncStorage
   */
  async loadCache() {
    try {
      const cacheData = await AsyncStorage.getItem(CACHE_STORAGE_KEY);
      if (cacheData) {
        this.cache = JSON.parse(cacheData);
        // Clean expired cache entries
        this.cleanExpiredCache();
        console.log(`Loaded ${Object.keys(this.cache).length} cached responses`);
      }
    } catch (error) {
      console.error('Error loading cache:', error);
      this.cache = {};
    }
  }

  /**
   * Save cache to AsyncStorage
   */
  async saveCache() {
    try {
      await AsyncStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(this.cache));
    } catch (error) {
      console.error('Error saving cache:', error);
    }
  }

  /**
   * Clean expired cache entries
   */
  cleanExpiredCache() {
    const now = Date.now();
    Object.keys(this.cache).forEach(key => {
      if (now - this.cache[key].timestamp > CACHE_EXPIRY_TIME) {
        delete this.cache[key];
      }
    });
  }

  /**
   * Add request to queue
   */
  async addToQueue(request) {
    if (this.queue.length >= MAX_QUEUE_SIZE) {
      console.warn('Queue is full, removing oldest request');
      this.queue.shift();
    }

    this.queue.push({
      ...request,
      id: `${Date.now()}_${Math.random()}`,
      timestamp: Date.now(),
      attempts: 0,
    });

    await this.saveQueue();
    console.log(`Added request to queue: ${request.method} ${request.url}`);
  }

  /**
   * Remove request from queue
   */
  async removeFromQueue(requestId) {
    this.queue = this.queue.filter(req => req.id !== requestId);
    await this.saveQueue();
  }

  /**
   * Get cached response
   */
  getCachedResponse(cacheKey) {
    const cached = this.cache[cacheKey];
    if (!cached) {
      return null;
    }

    // Check if cache is expired
    if (Date.now() - cached.timestamp > CACHE_EXPIRY_TIME) {
      delete this.cache[cacheKey];
      return null;
    }

    return cached.data;
  }

  /**
   * Set cached response
   */
  async setCachedResponse(cacheKey, data) {
    this.cache[cacheKey] = {
      data,
      timestamp: Date.now(),
    };
    await this.saveCache();
  }

  /**
   * Generate cache key from request
   */
  generateCacheKey(url, method = 'GET', params = {}) {
    const paramString = JSON.stringify(params);
    return `${method}:${url}:${paramString}`;
  }

  /**
   * Make a network request with offline support
   */
  async fetch(url, options = {}) {
    const {
      method = 'GET',
      headers = {},
      body = null,
      cache = true,
      priority = 'normal', // 'normal' | 'high'
    } = options;

    const cacheKey = this.generateCacheKey(url, method, body ? JSON.parse(body) : {});

    // If offline and GET request with cache, return cached data
    if (!this.isOnline && method === 'GET' && cache) {
      const cachedData = this.getCachedResponse(cacheKey);
      if (cachedData) {
        console.log(`Returning cached data for: ${url}`);
        return { data: cachedData, fromCache: true };
      }
      throw new Error('No internet connection and no cached data available');
    }

    // If offline and non-GET request, queue it
    if (!this.isOnline && method !== 'GET') {
      await this.addToQueue({
        url,
        method,
        headers,
        body,
        priority,
      });
      throw new Error('Request queued for later sync');
    }

    // Online - make the request
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Cache GET requests
      if (method === 'GET' && cache) {
        await this.setCachedResponse(cacheKey, data);
      }

      return { data, fromCache: false };
    } catch (error) {
      // If network error and GET request, try cache
      if (method === 'GET' && cache) {
        const cachedData = this.getCachedResponse(cacheKey);
        if (cachedData) {
          console.log(`Network error, returning cached data for: ${url}`);
          return { data: cachedData, fromCache: true };
        }
      }

      // Queue non-GET requests for retry
      if (method !== 'GET') {
        await this.addToQueue({
          url,
          method,
          headers,
          body,
          priority,
        });
      }

      throw error;
    }
  }

  /**
   * Sync queued requests when back online
   */
  async syncQueue() {
    if (this.syncInProgress || !this.isOnline || this.queue.length === 0) {
      return;
    }

    this.syncInProgress = true;
    console.log(`Syncing ${this.queue.length} queued requests...`);

    // Sort by priority (high priority first) and timestamp
    const sortedQueue = [...this.queue].sort((a, b) => {
      if (a.priority === 'high' && b.priority !== 'high') return -1;
      if (a.priority !== 'high' && b.priority === 'high') return 1;
      return a.timestamp - b.timestamp;
    });

    const results = {
      success: 0,
      failed: 0,
      errors: [],
    };

    for (const request of sortedQueue) {
      if (!this.isOnline) {
        console.log('Lost connection during sync, stopping...');
        break;
      }

      try {
        await this.retryRequest(request);
        await this.removeFromQueue(request.id);
        results.success++;
      } catch (error) {
        console.error(`Failed to sync request ${request.id}:`, error);
        
        // Remove from queue if max attempts reached
        if (request.attempts >= RETRY_ATTEMPTS) {
          await this.removeFromQueue(request.id);
          results.failed++;
          results.errors.push({
            request,
            error: error.message,
          });
        } else {
          // Increment attempts
          const index = this.queue.findIndex(r => r.id === request.id);
          if (index !== -1) {
            this.queue[index].attempts++;
            await this.saveQueue();
          }
        }
      }

      // Small delay between requests to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    this.syncInProgress = false;
    console.log(`Sync complete: ${results.success} success, ${results.failed} failed`);

    return results;
  }

  /**
   * Retry a queued request
   */
  async retryRequest(request) {
    const { url, method, headers, body } = request;

    for (let attempt = 0; attempt < RETRY_ATTEMPTS; attempt++) {
      try {
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        if (attempt === RETRY_ATTEMPTS - 1) {
          throw error;
        }
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (attempt + 1)));
      }
    }
  }

  /**
   * Clear all cached data
   */
  async clearCache() {
    this.cache = {};
    await AsyncStorage.removeItem(CACHE_STORAGE_KEY);
    console.log('Cache cleared');
  }

  /**
   * Clear queue
   */
  async clearQueue() {
    this.queue = [];
    await AsyncStorage.removeItem(QUEUE_STORAGE_KEY);
    console.log('Queue cleared');
  }

  /**
   * Get queue status
   */
  getQueueStatus() {
    return {
      count: this.queue.length,
      items: this.queue.map(req => ({
        id: req.id,
        method: req.method,
        url: req.url,
        timestamp: req.timestamp,
        attempts: req.attempts,
        priority: req.priority,
      })),
    };
  }

  /**
   * Get cache status
   */
  getCacheStatus() {
    const entries = Object.keys(this.cache);
    const totalSize = JSON.stringify(this.cache).length;

    return {
      count: entries.length,
      sizeBytes: totalSize,
      sizeKB: (totalSize / 1024).toFixed(2),
    };
  }
}

// Create singleton instance
const offlineManager = new OfflineManager();

export default offlineManager;
