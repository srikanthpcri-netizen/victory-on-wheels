import { Dimensions, StyleSheet } from "react-native";

import { colors, radius, spacing } from "../../theme";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  gradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xxl,
    overflow: "hidden",
  },

  topGlow: {
    position: "absolute",
    top: -150,
    right: -110,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(212, 175, 55, 0.13)",
  },

  bottomGlow: {
    position: "absolute",
    bottom: -180,
    left: -120,
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
  },

  content: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  logoOuterRing: {
    width: 150,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 75,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.45)",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },

  logoMiddleRing: {
    width: 126,
    height: 126,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 63,
    borderWidth: 2,
    borderColor: colors.gold,
    backgroundColor: "rgba(17, 17, 17, 0.32)",
  },

  logoContainer: {
    width: 104,
    height: 104,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 52,
    backgroundColor: colors.white,
    shadowColor: colors.gold,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 12,
  },

  logoLetter: {
    color: colors.primary,
    fontSize: 52,
    lineHeight: 60,
    fontWeight: "900",
    letterSpacing: -3,
  },

  logoAccent: {
    position: "absolute",
    bottom: 22,
    width: 54,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.gold,
  },

  title: {
    marginTop: spacing.xxl,
    color: colors.white,
    fontSize: 30,
    lineHeight: 38,
    fontWeight: "900",
    letterSpacing: 0.4,
    textAlign: "center",
  },

  titleGold: {
    color: colors.gold,
  },

  tagline: {
    marginTop: spacing.sm,
    color: "rgba(255, 255, 255, 0.78)",
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "500",
    letterSpacing: 0.3,
    textAlign: "center",
  },

  roadContainer: {
    position: "absolute",
    bottom: 88,
    width: width * 0.78,
    alignItems: "center",
  },

  road: {
    width: "100%",
    height: 2,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255, 255, 255, 0.16)",
  },

  roadHighlight: {
    position: "absolute",
    width: "38%",
    height: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.gold,
  },

  footer: {
    position: "absolute",
    bottom: 38,
    color: "rgba(255, 255, 255, 0.55)",
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "600",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
});
