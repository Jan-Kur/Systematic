import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from 'expo-router'; // Or Tabs, Drawer, etc., depending on your layout
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { Platform, useColorScheme, View } from 'react-native';
import "../global.css";

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? 'light'; // Default to light if null

  // Define your background colors based on the scheme
  const backgroundColor = colorScheme === 'dark' ? '#08060A' : '#F6F5FF';

  // Determine the status bar style based on the background color
  // 'light' means light text/icons (for dark backgrounds)
  // 'dark' means dark text/icons (for light backgrounds)
  const statusBarStyle = colorScheme === 'dark' ? 'light' : 'dark';

  // Determine the navigation bar button style (Android only)
  const navigationBarStyle = colorScheme === 'dark' ? 'light' : 'dark';

  useEffect(() => {
    // Set the root view background color via SystemUI API
    // This helps ensure the edges match, especially during transitions or for splash screen continuity.
    SystemUI.setBackgroundColorAsync(backgroundColor);

    if (Platform.OS === 'android') {
      // Attempt to set the navigation bar background color explicitly
      // Although edge-to-edge makes it transparent via app.json,
      // this ensures consistency if transparency isn't fully applied or for specific devices.
      NavigationBar.setBackgroundColorAsync(backgroundColor);

      // Set the navigation bar button style for contrast
      NavigationBar.setButtonStyleAsync(navigationBarStyle);
    }
  }, [colorScheme, backgroundColor, navigationBarStyle]);

  return (
    // This View ensures the background color is applied to the entire screen area
    <View style={{ flex: 1, backgroundColor: backgroundColor }}>
      {/* Set the Status Bar style dynamically */}
      <StatusBar style={statusBarStyle} />

      {/* Your actual navigation structure (Stack, Tabs, etc.) */}
      {/* Make sure the navigator screens themselves don't override the background */}
      <Stack
        screenOptions={{
          headerShown: false, // Example: Hide default header if you have a custom one
          // Ensure Stack itself doesn't add conflicting background colors
          contentStyle: { backgroundColor: 'transparent' },
        }}
      />
      {/* Or <Tabs />, <Drawer />, etc. */}
    </View>
  );
}