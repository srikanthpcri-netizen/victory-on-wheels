import { MD3LightTheme, type MD3Theme } from "react-native-paper";

import { colors } from "./colors";

export const appTheme: MD3Theme = {
  ...MD3LightTheme,
  roundness: 14,
  colors: {
    ...MD3LightTheme.colors,

    primary: colors.primary,
    onPrimary: colors.white,
    primaryContainer: colors.primaryLight,
    onPrimaryContainer: colors.primaryDark,

    secondary: colors.gold,
    onSecondary: colors.black,
    secondaryContainer: colors.goldLight,
    onSecondaryContainer: colors.goldDark,

    tertiary: colors.charcoal,
    onTertiary: colors.white,

    background: colors.background,
    onBackground: colors.black,

    surface: colors.surface,
    onSurface: colors.black,
    surfaceVariant: colors.lightGray,
    onSurfaceVariant: colors.darkGray,

    outline: colors.border,
    outlineVariant: colors.divider,

    error: colors.error,
    onError: colors.white,
    errorContainer: colors.errorLight,
    onErrorContainer: colors.error,

    inverseSurface: colors.black,
    inverseOnSurface: colors.white,
    inversePrimary: colors.gold,

    shadow: colors.black,
    scrim: colors.overlay,
  },
};
