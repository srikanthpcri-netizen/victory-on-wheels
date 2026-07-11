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
    minHeight: 300,
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
    overflow: "hidden",
  },

  heroGlowTop: {
    position: "absolute",
    top: -110,
    right: -90,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(212, 175, 55, 0.16)",
  },

  heroGlowBottom: {
    position: "absolute",
    bottom: -130,
    left: -90,
    width: 280,
    height: 280,
    borderRadius: 140,
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

  brandArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: spacing.md,
  },

  brandOuter: {
    width: 108,
    height: 108,
    borderRadius: 54,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.gold,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },

  brandInner: {
    width: 86,
    height: 86,
    borderRadius: 43,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },

  brandLetter: {
    color: colors.primary,
    fontSize: 44,
    lineHeight: 50,
    fontWeight: fontWeight.black,
    letterSpacing: -2,
  },

  brandAccent: {
    position: "absolute",
    bottom: 15,
    width: 42,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.gold,
  },

  heroTitle: {
    marginTop: spacing.xl,
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
    letterSpacing: 1.2,
    textAlign: "center",
    textTransform: "uppercase",
  },

  formCard: {
    width: width - spacing.xxl * 2,
    alignSelf: "center",
    marginTop: -38,
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

  formEyebrow: {
    color: colors.primary,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: fontWeight.extraBold,
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },

  title: {
    marginTop: spacing.sm,
    color: colors.black,
    fontSize: fontSize.xxxl,
    lineHeight: lineHeight.xxxl,
    fontWeight: fontWeight.black,
  },

  subtitle: {
    marginTop: spacing.sm,
    color: colors.gray,
    fontSize: fontSize.md,
    lineHeight: 22,
    fontWeight: fontWeight.medium,
  },

  inputSection: {
    marginTop: spacing.xxl,
  },

  inputLabel: {
    marginBottom: spacing.sm,
    color: colors.darkGray,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    fontWeight: fontWeight.semiBold,
  },

  phoneField: {
    width: "100%",
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    overflow: "hidden",
  },

  phoneFieldFocused: {
    borderWidth: 2,
    borderColor: colors.primary,
  },

  phoneFieldError: {
    borderWidth: 1.5,
    borderColor: colors.error,
  },

  countryCodeBox: {
    width: 78,
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: colors.border,
    backgroundColor: colors.background,
  },

  countryCodeText: {
    color: colors.black,
    fontSize: fontSize.lg,
    lineHeight: lineHeight.lg,
    fontWeight: fontWeight.bold,
  },

  phoneInput: {
    flex: 1,
    minHeight: 56,
    paddingHorizontal: spacing.lg,
    paddingVertical: 0,
    color: colors.black,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
    backgroundColor: colors.white,
  },

  errorText: {
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
    color: colors.error,
    fontSize: fontSize.sm,
    lineHeight: 17,
    fontWeight: fontWeight.medium,
  },

  buttonContainer: {
    marginTop: spacing.xl,
  },

  termsText: {
    marginTop: spacing.lg,
    color: colors.gray,
    fontSize: 11,
    lineHeight: 17,
    fontWeight: fontWeight.medium,
    textAlign: "center",
  },

  termsHighlight: {
    color: colors.primary,
    fontWeight: fontWeight.bold,
  },

  benefitSection: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xxxl,
  },

  benefitTitle: {
    color: colors.black,
    fontSize: fontSize.lg,
    lineHeight: lineHeight.lg,
    fontWeight: fontWeight.extraBold,
    textAlign: "center",
  },

  benefitGrid: {
    marginTop: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  benefitItem: {
    width: "31%",
    alignItems: "center",
  },

  benefitIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryLight,
  },

  benefitIconText: {
    fontSize: 22,
    lineHeight: 26,
  },

  benefitText: {
    marginTop: spacing.sm,
    color: colors.darkGray,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: fontWeight.semiBold,
    textAlign: "center",
  },
});
