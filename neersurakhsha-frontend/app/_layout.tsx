import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts as useInterFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { useFonts as useMontserratFonts, Montserrat_600SemiBold, Montserrat_700Bold, Montserrat_800ExtraBold } from '@expo-google-fonts/montserrat';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Prevent splash screen from hiding automatically
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [interLoaded, interError] = useInterFonts({
    'Inter': Inter_400Regular, 
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [montserratLoaded, montserratError] = useMontserratFonts({
    'Montserrat': Montserrat_700Bold,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
  });

  const loaded = interLoaded && montserratLoaded;
  const error = interError || montserratError;

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
