import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/components/useColorScheme";
import { ThemeProvider as CustomThemeProvider } from "../themeContext"; // Your custom logic

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <CustomThemeProvider> {/* Wrap everything in your theme context */}
      <NavigationThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ title: "Home", headerShown: true }} />
          <Stack.Screen name="login" options={{ title: "Login", headerShown: true }} />
          <Stack.Screen name="signup" options={{ title: "Sign Up", headerShown: true }} />
          <Stack.Screen name="settings" options={{ title: "Settings", headerShown: true }} />
          <Stack.Screen name="homepage" options={{ title: "Homepage", headerShown: true }} />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
          <Stack.Screen name="policy" options={{ title: "policy", headerShown: true }} />
        </Stack>
      </NavigationThemeProvider>
    </CustomThemeProvider>
  );
}
