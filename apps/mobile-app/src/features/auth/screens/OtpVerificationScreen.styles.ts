import { Dimensions, StyleSheet } from "react-native";

import {
  colors,
  fontSize,
  fontWeight,
  lineHeight,
  radius,
  spacing,
} from "../../../theme";

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

  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xxxl,
  },

  heroSection: {
    minHeight: 250,
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
    overflow: "hidden",
  },

  heroGlowTop: {
    position: "absolute",
    top: -100,
    right: -90,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(212, 175, 55, 0.16)",
  },

  heroGlowBottom: {
    position: "absolute",
    bottom: -120,
    left: -90,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.16)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
  },

  backButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },

  backArrow: {
    color: colors.white,
    fontSize: 30,
    lineHeight: 32,
    fontWeight: fontWeight.medium,
    marginTop: -2,
  },

  heroContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: spacing.lg,
  },

  heroIcon: {
    width: 82,
    height: 82,
    borderRadius: 41,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.gold,
  },

  heroIconText: {
    color: colors.primary,
    fontSize: 34,
    fontWeight: fontWeight.black,
  },

  heroTitle: {
    marginTop: spacing.lg,
    color: colors.white,
    fontSize: fontSize.xxl,
    lineHeight: lineHeight.xxl,
    fontWeight: fontWeight.black,
    textAlign: "center",
  },

  heroSubtitle: {
    marginTop: spacing.xs,
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    fontWeight: fontWeight.semiBold,
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },

  formCard: {
    width: width - spacing.xxl * 2,
    alignSelf: "center",
    marginTop: -34,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    elevation: 8,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 22,
  },

  eyebrow: {
    color: colors.primary,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: fontWeight.extraBold,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },

  title: {
    marginTop: spacing.sm,
    color: colors.black,
    fontSize: fontSize.xxxl,
    lineHeight: lineHeight.xxxl,
    fontWeight: fontWeight.black,
  },

  description: {
    marginTop: spacing.sm,
    color: colors.gray,
    fontSize: fontSize.md,
    lineHeight: 22,
    fontWeight: fontWeight.medium,
  },

  phoneNumber: {
    color: colors.black,
    fontWeight: fontWeight.bold,
  },

  otpContainer: {
    marginTop: spacing.xxl,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  otpInput: {
    width: 46,
    height: 56,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    color: colors.black,
    fontSize: 22,
    fontWeight: fontWeight.bold,
    textAlign: "center",
  },

  otpInputFocused: {
    borderWidth: 2,
    borderColor: colors.primary,
  },

  otpInputError: {
    borderColor: colors.error,
  },

  errorText: {
    marginTop: spacing.sm,
    color: colors.error,
    fontSize: fontSize.sm,
    lineHeight: 17,
    fontWeight: fontWeight.medium,
    textAlign: "center",
  },

  buttonContainer: {
    marginTop: spacing.xxl,
  },

  resendContainer: {
    marginTop: spacing.xl,
    alignItems: "center",
  },

  resendText: {
    color: colors.gray,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    fontWeight: fontWeight.medium,
  },

  resendAction: {
    marginTop: spacing.xs,
    color: colors.primary,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    fontWeight: fontWeight.bold,
  },

  timerText: {
    marginTop: spacing.xs,
    color: colors.darkGray,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    fontWeight: fontWeight.semiBold,
  },

  secureNote: {
    marginTop: spacing.xxxl,
    paddingHorizontal: spacing.xxl,
    color: colors.gray,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: fontWeight.medium,
    textAlign: "center",
  },
});
