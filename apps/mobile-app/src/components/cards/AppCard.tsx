import type { PropsWithChildren } from "react";
import {
  Pressable,
  type PressableProps,
  View,
  type ViewStyle,
} from "react-native";

import { styles } from "./AppCard.styles";

export type AppCardVariant = "elevated" | "outlined" | "flat";

export type AppCardProps = PropsWithChildren<{
  variant?: AppCardVariant;
  style?: ViewStyle | ViewStyle[];
  contentStyle?: ViewStyle | ViewStyle[];
  onPress?: PressableProps["onPress"];
  disabled?: boolean;
  testID?: string;
}>;

export function AppCard({
  children,
  variant = "elevated",
  style,
  contentStyle,
  onPress,
  disabled = false,
  testID,
}: AppCardProps) {
  const cardStyle = [
    styles.card,
    variant === "elevated" && styles.elevated,
    variant === "outlined" && styles.outlined,
    variant === "flat" && styles.flat,
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        testID={testID}
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [
          cardStyle,
          pressed && !disabled && styles.pressed,
        ]}
      >
        <View style={[styles.content, contentStyle]}>{children}</View>
      </Pressable>
    );
  }

  return (
    <View testID={testID} style={cardStyle}>
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
}
