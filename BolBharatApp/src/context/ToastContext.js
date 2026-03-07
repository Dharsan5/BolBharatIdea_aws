import React, { createContext, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Toast from '../components/Toast';

export const ToastContext = createContext();

/**
 * ToastProvider
 * 
 * Provides toast notification functionality throughout the app.
 * Manages toast queue and displaying/dismissing toasts.
 * 
 * Usage:
 * 1. Wrap your app with <ToastProvider>
 * 2. Use the useToast() hook in any component to show toasts
 */

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Show a toast notification
  const showToast = useCallback((options) => {
    const {
      type = 'info',
      message,
      messageHindi,
      duration = 3000,
      actionText,
      onActionPress,
      position = 'top',
    } = options;

    const id = Date.now() + Math.random();
    
    const newToast = {
      id,
      type,
      message,
      messageHindi,
      duration,
      actionText,
      onActionPress,
      position,
    };

    setToasts((prevToasts) => [...prevToasts, newToast]);

    return id;
  }, []);

  // Show success toast
  const showSuccess = useCallback((message, messageHindi, options = {}) => {
    return showToast({
      type: 'success',
      message,
      messageHindi,
      ...options,
    });
  }, [showToast]);

  // Show error toast
  const showError = useCallback((message, messageHindi, options = {}) => {
    return showToast({
      type: 'error',
      message,
      messageHindi,
      duration: 4000, // Errors stay longer by default
      ...options,
    });
  }, [showToast]);

  // Show warning toast
  const showWarning = useCallback((message, messageHindi, options = {}) => {
    return showToast({
      type: 'warning',
      message,
      messageHindi,
      ...options,
    });
  }, [showToast]);

  // Show info toast
  const showInfo = useCallback((message, messageHindi, options = {}) => {
    return showToast({
      type: 'info',
      message,
      messageHindi,
      ...options,
    });
  }, [showToast]);

  // Dismiss a specific toast
  const dismissToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  // Dismiss all toasts
  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const value = {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    dismissToast,
    dismissAll,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} dismissToast={dismissToast} />
    </ToastContext.Provider>
  );
};

/**
 * ToastContainer
 * 
 * Renders all active toasts.
 * Separate top and bottom containers for positioning.
 */
const ToastContainer = ({ toasts, dismissToast }) => {
  const topToasts = toasts.filter((toast) => toast.position === 'top');
  const bottomToasts = toasts.filter((toast) => toast.position === 'bottom');

  return (
    <>
      {/* Top toasts */}
      <View style={styles.topContainer} pointerEvents="box-none">
        {topToasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            messageHindi={toast.messageHindi}
            duration={toast.duration}
            onDismiss={() => dismissToast(toast.id)}
            actionText={toast.actionText}
            onActionPress={toast.onActionPress}
            position="top"
          />
        ))}
      </View>

      {/* Bottom toasts */}
      <View style={styles.bottomContainer} pointerEvents="box-none">
        {bottomToasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            messageHindi={toast.messageHindi}
            duration={toast.duration}
            onDismiss={() => dismissToast(toast.id)}
            actionText={toast.actionText}
            onActionPress={toast.onActionPress}
            position="bottom"
          />
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
});
