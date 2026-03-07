import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext';

/**
 * useToast Hook
 * 
 * Custom hook to access toast notification functionality.
 * 
 * @returns {object} Toast methods
 * - showToast(options) - Show a custom toast
 * - showSuccess(message, messageHindi, options) - Show success toast
 * - showError(message, messageHindi, options) - Show error toast
 * - showWarning(message, messageHindi, options) - Show warning toast
 * - showInfo(message, messageHindi, options) - Show info toast
 * - dismissToast(id) - Dismiss a specific toast
 * - dismissAll() - Dismiss all toasts
 * 
 * @example
 * const toast = useToast();
 * 
 * // Show success toast
 * toast.showSuccess('Profile updated!', 'प्रोफ़ाइल अपडेट किया गया!');
 * 
 * // Show error toast
 * toast.showError('Failed to save', 'सेव करने में विफल');
 * 
 * // Show toast with action
 * toast.showToast({
 *   type: 'info',
 *   message: 'New scheme available',
 *   messageHindi: 'नई योजना उपलब्ध',
 *   actionText: 'View',
 *   onActionPress: () => navigation.navigate('SchemeDetail'),
 * });
 */

const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};

export default useToast;
