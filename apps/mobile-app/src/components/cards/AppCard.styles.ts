import { StyleSheet } from "react-native";

import { colors, radius, spacing } from "../../theme";

export const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: radius.lg,
    backgroundColor: colors.white,
  },

  elevated: {
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },

  outlined: {
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 0,
  },

  flat: {
    elevation: 0,
  },

  content: {
    padding: spacing.lg,
  },

  pressed: {
    opacity: 0.92,
  },
});
