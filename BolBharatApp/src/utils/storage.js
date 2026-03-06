import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistor } from '../store';

/**
 * Storage utilities for managing AsyncStorage and Redux persist
 */

/**
 * Clear all persisted Redux state
 * Useful for logout or debugging
 */
export const clearPersistedState = async () => {
  try {
    await persistor.purge();
    console.log('Persisted state cleared successfully');
  } catch (error) {
    console.error('Error clearing persisted state:', error);
    throw error;
  }
};

/**
 * Clear all AsyncStorage data
 * WARNING: This will remove ALL stored data
 */
export const clearAllStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log('All AsyncStorage data cleared');
  } catch (error) {
    console.error('Error clearing AsyncStorage:', error);
    throw error;
  }
};

/**
 * Get storage usage information
 */
export const getStorageInfo = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const stores = await AsyncStorage.multiGet(keys);
    
    const totalSize = stores.reduce((acc, [key, value]) => {
      return acc + (value ? value.length : 0);
    }, 0);
    
    return {
      totalKeys: keys.length,
      totalSize: totalSize,
      totalSizeKB: (totalSize / 1024).toFixed(2),
      keys: keys,
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    throw error;
  }
};

/**
 * Get a specific item from AsyncStorage
 */
export const getItem = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`Error getting item ${key}:`, error);
    return null;
  }
};

/**
 * Set a specific item in AsyncStorage
 */
export const setItem = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting item ${key}:`, error);
    return false;
  }
};

/**
 * Remove a specific item from AsyncStorage
 */
export const removeItem = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing item ${key}:`, error);
    return false;
  }
};

/**
 * Check if storage is available
 */
export const isStorageAvailable = async () => {
  try {
    const testKey = '@storage_test';
    await AsyncStorage.setItem(testKey, 'test');
    await AsyncStorage.removeItem(testKey);
    return true;
  } catch (error) {
    console.error('Storage is not available:', error);
    return false;
  }
};
