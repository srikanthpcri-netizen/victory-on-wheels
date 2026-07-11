import { StyleSheet } from "react-native";

import { colors, radius, spacing } from "../../theme";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  input: {
    backgroundColor: colors.white,
  },

  content: {
    minHeight: 54,
    paddingHorizontal: spacing.md,
  },

  outline: {
    borderRadius: radius.md,
  },

  errorText: {
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
    color: colors.error,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500",
  },
});
