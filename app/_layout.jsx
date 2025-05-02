import { Stack } from 'expo-router';
import "../global.css";


//SplashScreen.preventAutoHideAsync();


export default function RootLayout() {
  /*const [loaded, error] = useFonts({
    'Geist': require('@/fonts/Geist-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }*/

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
    </Stack>
    )
}