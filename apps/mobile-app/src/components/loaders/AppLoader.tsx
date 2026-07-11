import { View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";

import { colors } from "../../theme";
import { styles } from "./AppLoader.styles";

export type AppLoaderProps = {
  fullScreen?: boolean;
  size?: "small" | "large";
  message?: string;
};

export function AppLoader({
  fullScreen = false,
  size = "large",
  message,
}: AppLoaderProps) {
  return (
    <View style={fullScreen ? styles.fullScreen : styles.inline}>
      <ActivityIndicator animating size={size} color={colors.primary} />

      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}
