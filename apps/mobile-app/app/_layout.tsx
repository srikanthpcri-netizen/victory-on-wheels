import "react-native-gesture-handler";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { AppProviders } from "../src/providers";
import { colors } from "../src/theme";

export default function RootLayout() {
  return (
    <AppProviders>
      <StatusBar style="light" backgroundColor={colors.primary} />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.background,
          },
          animation: "fade",
        }}
      />
    </AppProviders>
  );
}
