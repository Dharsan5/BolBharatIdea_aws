import React, { Component } from 'react';
import ErrorScreen from './ErrorScreen';

/**
 * ErrorBoundary Component
 * 
 * A React Error Boundary that catches JavaScript errors anywhere in the child
 * component tree and displays a fallback UI instead of crashing the app.
 * 
 * Usage:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * 
 * Props:
 * - fallback: React component (optional) - Custom error screen component
 * - onError: function (optional) - Callback when error is caught
 * - onReset: function (optional) - Callback when user clicks retry
 */

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console (in production, send to error tracking service)
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Store error details in state
    this.setState({
      error,
      errorInfo,
    });

    // Call optional error callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // TODO: Send error to error tracking service (e.g., Sentry, Bugsnag)
    // Example:
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    // Reset error state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Call optional reset callback
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Render default error screen
      return (
        <ErrorScreen
          type="generic"
          title="Oops! Something went wrong"
          titleHindi="उफ़! कुछ गलत हो गया"
          message="The app encountered an unexpected error. Please try reloading."
          messageHindi="ऐप में एक अप्रत्याशित त्रुटि हुई। कृपया पुनः लोड करने का प्रयास करें।"
          onRetry={this.handleReset}
          retryLabel="Reload App"
          retryLabelHindi="ऐप पुनः लोड करें"
          showGoBack={false}
          showGoHome={false}
        />
      );
    }

    // Render children normally when there's no error
    return this.props.children;
  }
}

export default ErrorBoundary;
