import type { ComponentProps } from "react";
import { View } from "react-native";
import { HelperText, TextInput } from "react-native-paper";

import { colors } from "../../theme";
import { styles } from "./AppInput.styles";

type PaperTextInputProps = ComponentProps<typeof TextInput>;

export type AppInputProps = PaperTextInputProps & {
  errorMessage?: string;
};

export function AppInput({
  mode = "outlined",
  style,
  contentStyle,
  outlineStyle,
  error,
  errorMessage,
  ...inputProps
}: AppInputProps) {
  const hasError = Boolean(error || errorMessage);

  return (
    <View style={styles.container}>
      <TextInput
        {...inputProps}
        mode={mode}
        error={hasError}
        style={[styles.input, style]}
        contentStyle={[styles.content, contentStyle]}
        outlineStyle={[styles.outline, outlineStyle]}
        outlineColor={colors.border}
        activeOutlineColor={colors.primary}
        cursorColor={colors.primary}
        selectionColor={colors.primaryLight}
        textColor={colors.black}
      />

      {errorMessage ? (
        <HelperText
          type="error"
          visible
          padding="none"
          style={styles.errorText}
        >
          {errorMessage}
        </HelperText>
      ) : null}
    </View>
  );
}
