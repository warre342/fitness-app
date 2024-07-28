import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import useDatabase from '@/hooks/useDatabaseLoading';
import { DatabaseContextProvider } from '../context/databaseContext'
import { NativeBaseProvider } from 'native-base';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const isDBLoadingComplete = useDatabase();
  console.log("database:",isDBLoadingComplete,", fonts:", loaded)

  useEffect(() => {
    if (loaded && isDBLoadingComplete) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isDBLoadingComplete]);

  if (!loaded || !isDBLoadingComplete) {
    return null;
  }

  return (
    <NativeBaseProvider>
      <DatabaseContextProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ThemeProvider>
      </DatabaseContextProvider>
    </NativeBaseProvider>

  );
  /*
    if (loaded && isDBLoadingComplete) {
      SplashScreen.hideAsync();
      return (
        <UsersContextProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
              </Stack>
            </ThemeProvider>
        </UsersContextProvider>
    );
    }
    else{
      return null; 
    }*/
}
