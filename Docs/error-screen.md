# Error Screens Components

A comprehensive set of error handling components for the BolBharat app with bilingual support (English/Hindi).

## Components

### 1. ErrorScreen
Full-page error screen component for displaying various error states.

**Location:** `src/components/ErrorScreen.js`

**Features:**
- 8 pre-configured error types with appropriate icons and messages
- Bilingual support (English/Hindi)
- Customizable titles and messages
- Multiple action buttons (retry, go back, go home)
- Contextual help text for specific errors
- Responsive layout with scroll support

**Error Types:**
- `network` - Network/connectivity errors
- `notFound` - 404 Not Found errors
- `server` - 500 Server errors
- `permission` - Permission denied errors
- `generic` - Generic/unknown errors
- `empty` - Empty state (no data)
- `maintenance` - Under maintenance
- `timeout` - Request timeout errors

**Example Usage:**
```jsx
import ErrorScreen from '../components/ErrorScreen';

// Basic usage
<ErrorScreen
  type="network"
  onRetry={() => fetchData()}
  onGoBack={() => navigation.goBack()}
/>

// Custom error
<ErrorScreen
  type="generic"
  title="Custom Error Title"
  titleHindi="कस्टम त्रुटि शीर्षक"
  message="Your custom error message"
  messageHindi="आपका कस्टम त्रुटि संदेश"
  onRetry={handleRetry}
  showGoHome={true}
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | string | `'generic'` | Error type: network, notFound, server, permission, generic, empty, maintenance, timeout |
| `title` | string | null | Custom error title (overrides default) |
| `titleHindi` | string | null | Custom error title in Hindi |
| `message` | string | null | Custom error message (overrides default) |
| `messageHindi` | string | null | Custom error message in Hindi |
| `onRetry` | function | null | Callback for retry button |
| `onGoBack` | function | null | Callback for go back button |
| `onGoHome` | function | null | Callback for go home button |
| `retryLabel` | string | 'Try Again' | Custom retry button label |
| `retryLabelHindi` | string | 'पुन: प्रयास करें' | Custom retry button label in Hindi |
| `showRetry` | boolean | true | Show/hide retry button |
| `showGoBack` | boolean | true | Show/hide go back button |
| `showGoHome` | boolean | false | Show/hide go home button |

---

### 2. ErrorBoundary
React error boundary component that catches JavaScript errors in child components.

**Location:** `src/components/ErrorBoundary.js`

**Features:**
- Catches unhandled errors in React component tree
- Prevents app crashes
- Displays fallback UI
- Allows error recovery with reset button
- Logs errors to console (can integrate with error tracking services)

**Example Usage:**
```jsx
import ErrorBoundary from '../components/ErrorBoundary';

// Wrap entire app or specific sections
export default function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.log('Error caught:', error);
        // Send to error tracking service
      }}
    >
      <YourApp />
    </ErrorBoundary>
  );
}

// Wrap specific screens
function MyScreen() {
  return (
    <ErrorBoundary>
      <ComplexComponent />
    </ErrorBoundary>
  );
}

// Custom fallback UI
<ErrorBoundary
  fallback={<CustomErrorScreen />}
  onReset={() => {
    // Custom reset logic
  }}
>
  <YourComponent />
</ErrorBoundary>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fallback` | React component | null | Custom error screen component (default uses ErrorScreen) |
| `onError` | function | null | Callback when error is caught (error, errorInfo) |
| `onReset` | function | null | Callback when user clicks retry/reset |

---

### 3. InlineError
Small inline error message component for forms and validations.

**Location:** `src/components/InlineError.js`

**Features:**
- Compact error display
- Bilingual support
- Customizable icon
- Show/hide with visible prop
- Left border accent for visibility

**Example Usage:**
```jsx
import InlineError from '../components/InlineError';

// Basic form validation error
<InlineError
  message="Email is required"
  messageHindi="ईमेल आवश्यक है"
/>

// With custom icon
<InlineError
  message="Password must be at least 8 characters"
  messageHindi="पासवर्ड कम से कम 8 वर्णों का होना चाहिए"
  icon="lock-closed-outline"
/>

// Conditional display
<InlineError
  message="Username already exists"
  visible={errors.username}
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `message` | string | required | Error message to display |
| `messageHindi` | string | null | Error message in Hindi |
| `icon` | string | 'alert-circle' | Ionicons icon name |
| `visible` | boolean | true | Show/hide error message |
| `style` | object | {} | Additional styles for container |

---

## Integration Examples

### API Error Handling
```jsx
import { useState } from 'react';
import ErrorScreen from '../components/ErrorScreen';

function MyScreen() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/data');
      if (!response.ok) {
        if (response.status === 404) {
          setError('notFound');
        } else if (response.status >= 500) {
          setError('server');
        } else {
          setError('generic');
        }
      }
    } catch (err) {
      setError('network');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <ErrorScreen
        type={error}
        onRetry={fetchData}
        onGoBack={() => navigation.goBack()}
      />
    );
  }

  return <YourNormalContent />;
}
```

### Form Validation
```jsx
import { useState } from 'react';
import InlineError from '../components/InlineError';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    if (!email) {
      return { message: 'Email is required', messageHindi: 'ईमेल आवश्यक है' };
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return { 
        message: 'Please enter a valid email', 
        messageHindi: 'कृपया एक वैध ईमेल दर्ज करें' 
      };
    }
    return null;
  };

  const handleSubmit = () => {
    const emailError = validateEmail(email);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }
    // Submit form
  };

  return (
    <View>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
      />
      {errors.email && (
        <InlineError
          message={errors.email.message}
          messageHindi={errors.email.messageHindi}
          icon="mail-outline"
        />
      )}
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}
```

### App-level Error Boundary
```jsx
// App.js
import ErrorBoundary from './src/components/ErrorBoundary';
import * as Sentry from '@sentry/react-native';

export default function App() {
  const handleError = (error, errorInfo) => {
    // Log to console
    console.error('App Error:', error, errorInfo);
    
    // Send to error tracking service
    Sentry.captureException(error, { extra: errorInfo });
  };

  return (
    <ErrorBoundary onError={handleError}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </ErrorBoundary>
  );
}
```

### Network Status with Error Handling
```jsx
import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import ErrorScreen from '../components/ErrorScreen';

function MyScreen() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  if (!isConnected) {
    return (
      <ErrorScreen
        type="network"
        onRetry={() => {
          // Retry fetching data
          refetch();
        }}
      />
    );
  }

  return <YourContent />;
}
```

---

## Demo Screen

A demo screen is available at `src/screens/ErrorScreensDemo.js` that showcases all error types and inline error examples.

To use the demo:
1. Add the screen to your navigation
2. Navigate to it from settings or developer menu
3. Tap on different error types to see full-screen displays
4. Toggle inline errors to see form validation examples

---

## Best Practices

### 1. Use Specific Error Types
```jsx
// Good
<ErrorScreen type="network" onRetry={refetch} />

// Avoid generic when specific type is known
<ErrorScreen type="generic" /> // Only when error type is truly unknown
```

### 2. Provide Retry Actions
```jsx
// Good - gives user a way to recover
<ErrorScreen 
  type="server" 
  onRetry={refetch}
  onGoBack={() => navigation.goBack()}
/>

// Missing - user is stuck
<ErrorScreen type="server" />
```

### 3. Use Error Boundaries for Critical Sections
```jsx
// Wrap navigation or critical features
<ErrorBoundary>
  <NavigationContainer>
    <AppNavigator />
  </NavigationContainer>
</ErrorBoundary>
```

### 4. Bilingual Support
Always provide Hindi translations when using custom messages:
```jsx
<ErrorScreen
  title="Payment Failed"
  titleHindi="भुगतान विफल"
  message="Your payment could not be processed"
  messageHindi="आपका भुगतान संसाधित नहीं किया जा सका"
/>
```

### 5. Inline Errors for Forms
```jsx
// Show errors next to fields
<TextInput {...props} />
<InlineError 
  visible={!!errors.field}
  message={errors.field?.message}
  messageHindi={errors.field?.messageHindi}
/>
```

---

## Error Logging Integration

### With Sentry
```jsx
import * as Sentry from '@sentry/react-native';

<ErrorBoundary
  onError={(error, errorInfo) => {
    Sentry.captureException(error, {
      extra: errorInfo,
      tags: { component: 'MyScreen' }
    });
  }}
>
  <YourComponent />
</ErrorBoundary>
```

### With Firebase Crashlytics
```jsx
import crashlytics from '@react-native-firebase/crashlytics';

<ErrorBoundary
  onError={(error, errorInfo) => {
    crashlytics().recordError(error);
    crashlytics().log(JSON.stringify(errorInfo));
  }}
>
  <YourComponent />
</ErrorBoundary>
```

---

## Testing

### Test Error Boundary
```jsx
// Create a component that throws an error
function BuggyComponent() {
  throw new Error('Test error');
}

// Test in your app
<ErrorBoundary>
  <BuggyComponent />
</ErrorBoundary>
```

### Test Error Screens
Use the ErrorScreensDemo component or manually trigger errors:
```jsx
<ErrorScreen type="network" onRetry={() => console.log('Retry')} />
```

---

## Accessibility

All error components include:
- Semantic color usage (red for errors, etc.)
- Clear bilingual text labels
- Touch-friendly button sizes (minimum 44x44)
- Icon indicators for visual communication
- Readable font sizes
- High contrast for visibility

---

## Notes

- All error messages are bilingual (English/Hindi) by default
- Components use the centralized theme for consistent styling
- Error screens are scrollable for smaller devices
- InlineError can be used for any type of inline notification
- ErrorBoundary should be used at app level and critical sections
- The demo screen is for development/testing only

---

## TODO

For production deployment:
- Integrate with error tracking service (Sentry, Crashlytics, etc.)
- Add analytics tracking for error occurrences
- Implement offline error queue
- Add error retry strategies
- Create error recovery mechanisms
- Add A/B testing for error messages
