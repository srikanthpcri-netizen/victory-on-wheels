import type { ComponentProps } from "react";
import { Button } from "react-native-paper";

import { colors } from "../../theme";
import { styles } from "./AppButton.styles";

type PaperButtonProps = ComponentProps<typeof Button>;

export type AppButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "text"
  | "danger";

export type AppButtonProps = Omit<
  PaperButtonProps,
  "mode" | "buttonColor" | "textColor"
> & {
  variant?: AppButtonVariant;
  fullWidth?: boolean;
  compactSize?: boolean;
};

type VariantConfig = {
  mode: PaperButtonProps["mode"];
  buttonColor?: string;
  textColor: string;
};

const variantConfig: Record<AppButtonVariant, VariantConfig> = {
  primary: {
    mode: "contained",
    buttonColor: colors.primary,
    textColor: colors.white,
  },

  secondary: {
    mode: "contained",
    buttonColor: colors.gold,
    textColor: colors.black,
  },

  outline: {
    mode: "outlined",
    textColor: colors.primary,
  },

  text: {
    mode: "text",
    textColor: colors.primary,
  },

  danger: {
    mode: "contained",
    buttonColor: colors.error,
    textColor: colors.white,
  },
};

export function AppButton({
  variant = "primary",
  fullWidth = true,
  compactSize = false,
  style,
  contentStyle,
  labelStyle,
  disabled,
  loading,
  children,
  ...buttonProps
}: AppButtonProps) {
  const config = variantConfig[variant];

  return (
    <Button
      {...buttonProps}
      mode={config.mode}
      buttonColor={config.buttonColor}
      textColor={config.textColor}
      disabled={disabled || loading}
      loading={loading}
      style={[
        styles.button,
        fullWidth && styles.fullWidth,
        compactSize && styles.compact,
        style,
      ]}
      contentStyle={[
        styles.content,
        compactSize && styles.compactContent,
        contentStyle,
      ]}
      labelStyle={[
        styles.label,
        compactSize && styles.compactLabel,
        labelStyle,
      ]}
    >
      {children}
    </Button>
  );
}
