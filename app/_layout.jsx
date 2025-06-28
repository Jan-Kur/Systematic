import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { ActivityIndicator, useColorScheme, View } from 'react-native';
import Colors from '../constants/Colors';
import { SessionProvider, useSession } from '../contexts/AuthContext';
import "../global.css";


export default function RootLayout() {
  const colorScheme = useColorScheme();

  const statusBarBackgroundColor = colorScheme === 'dark' ? Colors.dark.main : Colors.light.main;
  const statusBarStyle = colorScheme === 'dark' ? 'light' : 'dark';

  SystemUI.setBackgroundColorAsync(statusBarBackgroundColor);

  return (
   <SessionProvider>
      <StatusBar
        backgroundColor={statusBarBackgroundColor}
        style={statusBarStyle}
      />
      <RootNavigator/>
   </SessionProvider>
  );
}

function RootNavigator() {
   const { user, isLoading } = useSession();

   if (isLoading) {
     return (
       <View style={{ 
         flex: 1, 
         justifyContent: 'center', 
         alignItems: 'center',
         backgroundColor: Colors.light.main
       }}>
         <ActivityIndicator size="large" color={Colors.light.primary} />
       </View>
     );
   }

   return (
      <Stack screenOptions={{ headerShown: false }}>
         <Stack.Protected guard={user}>
            <Stack.Screen name="(tabs)" />
         </Stack.Protected>

         <Stack.Protected guard={!user}>
            <Stack.Screen name="(auth)" />
         </Stack.Protected>
      </Stack>
   );
}