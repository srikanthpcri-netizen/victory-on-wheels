export const colors = {
  primary: "#C90000",
  primaryDark: "#990000",
  primaryLight: "#FDECEC",

  gold: "#D4AF37",
  goldDark: "#A8871F",
  goldLight: "#FFF7D6",

  black: "#111111",
  charcoal: "#252525",
  darkGray: "#454545",
  gray: "#747474",
  lightGray: "#E8E8E8",

  white: "#FFFFFF",
  background: "#F7F7F8",
  surface: "#FFFFFF",

  success: "#16834A",
  successLight: "#E8F7EF",

  warning: "#D98200",
  warningLight: "#FFF4E1",

  error: "#C62828",
  errorLight: "#FDEAEA",

  info: "#1769AA",
  infoLight: "#EAF4FC",

  border: "#E5E5E5",
  divider: "#EEEEEE",
  disabled: "#BDBDBD",
  overlay: "rgba(0, 0, 0, 0.55)",
  transparent: "transparent",
} as const;

export type AppColor = keyof typeof colors;
