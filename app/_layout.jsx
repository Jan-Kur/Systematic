import Colors from '@/constants/Colors';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useColorScheme } from 'react-native';
import "../global.css";


export default function RootLayout() {
  const colorScheme = useColorScheme();

  const statusBarBackgroundColor = colorScheme === 'dark' ? Colors.dark.main : Colors.light.main;
  const statusBarStyle = colorScheme === 'dark' ? 'light' : 'dark';

  SystemUI.setBackgroundColorAsync(statusBarBackgroundColor);

  return (
    <>
      <StatusBar
        backgroundColor={statusBarBackgroundColor}
        style={statusBarStyle}
      />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}