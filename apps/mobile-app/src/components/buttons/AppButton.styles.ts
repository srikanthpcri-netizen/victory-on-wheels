import { StyleSheet } from "react-native";

import { radius, spacing } from "../../theme";

export const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    justifyContent: "center",
    borderRadius: radius.md,
  },

  content: {
    minHeight: 52,
    paddingHorizontal: spacing.lg,
  },

  label: {
    marginVertical: 0,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  fullWidth: {
    width: "100%",
  },

  compact: {
    minHeight: 42,
  },

  compactContent: {
    minHeight: 42,
    paddingHorizontal: spacing.md,
  },

  compactLabel: {
    fontSize: 14,
  },
});
