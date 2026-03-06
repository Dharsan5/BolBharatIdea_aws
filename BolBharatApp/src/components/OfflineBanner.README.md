# OfflineBanner Component

A reusable React Native component that displays a banner at the top of the screen to indicate offline status, limited connectivity, or offline mode.

## Features

- **Automatic Network Detection**: Uses `@react-native-community/netinfo` to detect connection status
- **Animated Entrance**: Smoothly slides in/out when connection state changes
- **Bilingual Support**: Shows messages in both English and Hindi
- **Sync Functionality**: Displays pending sync items count with sync button
- **Multiple States**: 
  - No Connection (red banner)
  - Offline Mode Enabled (orange banner)
  - Limited Connection - 2G/3G (yellow banner)
- **Platform Support**: Works on iOS and Android with proper status bar handling

## Installation

First, ensure you have the required dependency:

```bash
npm install @react-native-community/netinfo
```

Or with Expo:

```bash
npx expo install @react-native-community/netinfo
```

## Usage

### Basic Usage

```jsx
import OfflineBanner from '../components/OfflineBanner';

export default function MyScreen() {
  return (
    <View>
      <OfflineBanner />
      {/* Rest of your screen content */}
    </View>
  );
}
```

### With Sync Functionality

```jsx
import React, { useState } from 'react';
import OfflineBanner from '../components/OfflineBanner';

export default function MyScreen() {
  const [pendingItems, setPendingItems] = useState(5);

  const handleSync = async () => {
    // Your sync logic here
    console.log('Syncing pending items...');
    // After sync completes:
    setPendingItems(0);
  };

  return (
    <View>
      <OfflineBanner 
        onSync={handleSync}
        pendingItems={pendingItems}
      />
      {/* Rest of your screen content */}
    </View>
  );
}
```

### Force Offline Mode

```jsx
<OfflineBanner 
  offlineMode={true}  // Shows banner even when connected
  pendingItems={3}
  onSync={handleSync}
/>
```

### Manual Control

```jsx
import React, { useState } from 'react';
import OfflineBanner from '../components/OfflineBanner';

export default function MyScreen() {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <View>
      <OfflineBanner 
        visible={showBanner}  // Manually control visibility
        onSync={handleSync}
      />
      
      <Button 
        title="Toggle Banner" 
        onPress={() => setShowBanner(!showBanner)} 
      />
    </View>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean \| null` | `null` | Force show/hide banner regardless of network status. When `null`, banner visibility is automatically determined based on connection state. |
| `onSync` | `function \| null` | `null` | Callback function when sync button is pressed. If provided, sync button will be shown when online with pending items. |
| `pendingItems` | `number` | `0` | Number of items pending sync. Displayed on banner and used to show/hide sync button. |
| `offlineMode` | `boolean` | `false` | Whether app is in intentional offline mode (even with connection). Shows orange banner instead of red. |

## Banner States

### 1. No Internet Connection (Red)
- Displayed when device has no internet connectivity
- Shows "No Internet Connection" message
- Includes info text about using saved content

### 2. Offline Mode Enabled (Orange)
- Displayed when `offlineMode={true}` and device is connected
- Shows "Offline Mode Enabled" message
- Indicates user has intentionally enabled offline mode

### 3. Limited Connection (Yellow)
- Displayed when connected via cellular (2G/3G)
- Shows "Limited Connection" message
- Displays connection type badge

### 4. Connected (Hidden)
- Banner is hidden when connected via WiFi and not in offline mode
- Automatically slides out with animation

## Integration Examples

### Home Screen
```jsx
import OfflineBanner from '../components/OfflineBanner';

export default function HomeScreen({ navigation }) {
  const [pendingSync, setPendingSync] = useState(0);

  const handleSync = () => {
    // Sync logic
    Alert.alert('Syncing', 'Syncing pending items with server...');
    setPendingSync(0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <OfflineBanner 
        onSync={handleSync}
        pendingItems={pendingSync}
      />
      {/* Rest of content */}
    </SafeAreaView>
  );
}
```

### Forms Screen (with offline mode)
```jsx
import OfflineBanner from '../components/OfflineBanner';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FormsScreen() {
  const [offlineMode, setOfflineMode] = useState(false);
  const [savedForms, setSavedForms] = useState(0);

  useEffect(() => {
    // Load offline mode setting
    AsyncStorage.getItem('offlineMode').then(value => {
      setOfflineMode(value === 'true');
    });
    
    // Load saved forms count
    AsyncStorage.getItem('savedForms').then(value => {
      setSavedForms(parseInt(value) || 0);
    });
  }, []);

  const handleSync = async () => {
    // Upload saved forms
    await uploadSavedForms();
    setSavedForms(0);
  };

  return (
    <View>
      <OfflineBanner 
        offlineMode={offlineMode}
        pendingItems={savedForms}
        onSync={handleSync}
      />
      {/* Forms list */}
    </View>
  );
}
```

## Styling

The component uses a predefined color scheme from your theme:
- Error red for offline
- Orange for offline mode
- Warning yellow for limited connection
- White text for all states

The banner has high z-index (1000) to ensure it appears above other content.

## Platform Considerations

### iOS
- Accounts for status bar height (44px padding-top)
- Banner appears below status bar

### Android
- No status bar padding needed
- Banner appears at top of screen

## Network Detection

The component uses `@react-native-community/netinfo` which provides:
- Connection type detection (WiFi, Cellular, None)
- Real-time connection state updates
- Connection quality information

## TODO Integration

For production use, integrate with your offline sync manager:

```jsx
import { useOfflineManager } from '../hooks/useOfflineManager';

export default function MyScreen() {
  const { 
    isOffline, 
    pendingItems, 
    syncData 
  } = useOfflineManager();

  return (
    <OfflineBanner 
      visible={isOffline}
      pendingItems={pendingItems}
      onSync={syncData}
    />
  );
}
```

## Accessibility

- Uses semantic colors for different states
- Clear bilingual text labels
- Touch-friendly sync button (minimum 44x44 tap target)
- Icon indicators for visual communication

## Performance

- Minimal re-renders using React hooks
- Native animation for smooth transitions
- Automatic cleanup of network listeners
- Small memory footprint

## Testing

To test different states:

```jsx
// Test offline mode
<OfflineBanner visible={true} offlineMode={true} />

// Test with pending items
<OfflineBanner visible={true} pendingItems={5} />

// Test cellular connection (need to actually use cellular data)
// Banner will automatically detect and show limited connection state
```

## Notes

- Component automatically handles SafeAreaView on iOS
- Animation duration is ~300ms for smooth UX
- Banner height adjusts based on content
- Sync button only shows when connected and pendingItems > 0
