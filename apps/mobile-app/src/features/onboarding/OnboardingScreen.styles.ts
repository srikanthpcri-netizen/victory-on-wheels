import { Dimensions, StyleSheet } from "react-native";

import {
  colors,
  fontSize,
  fontWeight,
  lineHeight,
  radius,
  spacing,
} from "../../theme";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },

  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  topBar: {
    minHeight: 64,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  brandMark: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.gold,
  },

  brandLetter: {
    color: colors.white,
    fontSize: 18,
    fontWeight: fontWeight.black,
  },

  brandTextContainer: {
    marginLeft: spacing.sm,
  },

  brandTitle: {
    color: colors.black,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    fontWeight: fontWeight.extraBold,
  },

  brandSubtitle: {
    color: colors.gray,
    fontSize: 9,
    lineHeight: 12,
    fontWeight: fontWeight.semiBold,
    letterSpacing: 1,
  },

  skipButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },

  skipText: {
    color: colors.primary,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    fontWeight: fontWeight.bold,
  },

  slider: {
    flex: 1,
  },

  slide: {
    width,
    flex: 1,
    paddingHorizontal: spacing.xxl,
    alignItems: "center",
  },

  visualArea: {
    width: "100%",
    flex: 1,
    minHeight: 300,
    alignItems: "center",
    justifyContent: "center",
  },

  visualBackdrop: {
    position: "absolute",
    width: width * 0.72,
    height: width * 0.72,
    maxWidth: 330,
    maxHeight: 330,
    borderRadius: 999,
  },

  visualRingLarge: {
    width: 244,
    height: 244,
    borderRadius: 122,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.74)",
  },

  visualRingSmall: {
    width: 188,
    height: 188,
    borderRadius: 94,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    elevation: 8,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 18,
  },

  visualIconContainer: {
    width: 128,
    height: 128,
    borderRadius: 64,
    alignItems: "center",
    justifyContent: "center",
  },

  visualIcon: {
    fontSize: 60,
    lineHeight: 72,
  },

  checkIcon: {
    color: colors.white,
    fontSize: 60,
    lineHeight: 70,
    fontWeight: fontWeight.black,
  },

  miniBadgeLeft: {
    position: "absolute",
    left: 20,
    bottom: 58,
    minWidth: 100,
    minHeight: 46,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },

  miniBadgeRight: {
    position: "absolute",
    right: 18,
    top: 62,
    minWidth: 92,
    minHeight: 46,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },

  miniBadgeTitle: {
    color: colors.black,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: fontWeight.bold,
    textAlign: "center",
  },

  miniBadgeValue: {
    marginTop: 2,
    color: colors.primary,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: fontWeight.semiBold,
    textAlign: "center",
  },

  contentArea: {
    width: "100%",
    minHeight: 236,
    alignItems: "center",
    paddingBottom: spacing.md,
  },

  eyebrow: {
    color: colors.primary,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: fontWeight.extraBold,
    letterSpacing: 1.8,
    textAlign: "center",
  },

  title: {
    marginTop: spacing.md,
    color: colors.black,
    fontSize: fontSize.xxxl,
    lineHeight: lineHeight.xxxl,
    fontWeight: fontWeight.black,
    textAlign: "center",
    letterSpacing: -0.6,
  },

  description: {
    marginTop: spacing.md,
    maxWidth: 340,
    color: colors.gray,
    fontSize: fontSize.md,
    lineHeight: 22,
    fontWeight: fontWeight.medium,
    textAlign: "center",
  },

  footer: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxl,
  },

  pagination: {
    height: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: colors.lightGray,
  },

  activeDot: {
    width: 26,
    backgroundColor: colors.primary,
  },

  footerRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  previousButton: {
    width: 54,
    height: 54,
    marginRight: spacing.md,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },

  previousButtonText: {
    color: colors.black,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: fontWeight.bold,
  },

  nextButtonContainer: {
    flex: 1,
  },
});
