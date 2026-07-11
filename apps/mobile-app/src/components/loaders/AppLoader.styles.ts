import { StyleSheet } from "react-native";

import { colors, spacing } from "../../theme";

export const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    padding: spacing.xxl,
  },

  inline: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.lg,
  },

  message: {
    marginTop: spacing.md,
    color: colors.darkGray,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    fontWeight: "500",
  },
});
