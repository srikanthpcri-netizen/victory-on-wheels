import { useEffect } from "react";
import { Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { styles } from "./SplashScreen.styles";

const AnimatedView = Animated.createAnimatedComponent(View);

export function SplashScreen() {
  const router = useRouter();

  const logoScale = useSharedValue(0.72);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(18);
  const glowScale = useSharedValue(1);
  const roadProgress = useSharedValue(0);

  useEffect(() => {
    logoOpacity.value = withTiming(1, {
      duration: 650,
      easing: Easing.out(Easing.cubic),
    });

    logoScale.value = withSequence(
      withTiming(1.08, {
        duration: 650,
        easing: Easing.out(Easing.back(1.5)),
      }),
      withTiming(1, {
        duration: 220,
        easing: Easing.out(Easing.cubic),
      }),
    );

    textOpacity.value = withDelay(
      500,
      withTiming(1, {
        duration: 600,
      }),
    );

    textTranslateY.value = withDelay(
      500,
      withTiming(0, {
        duration: 600,
        easing: Easing.out(Easing.cubic),
      }),
    );

    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.12, {
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, {
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
        }),
      ),
      -1,
      true,
    );

    roadProgress.value = withRepeat(
      withTiming(1, {
        duration: 1600,
        easing: Easing.inOut(Easing.cubic),
      }),
      -1,
      false,
    );

    const navigationTimer = setTimeout(() => {
      router.replace("/onboarding");
    }, 2800);

    return () => {
      clearTimeout(navigationTimer);
    };
  }, [
    glowScale,
    logoOpacity,
    logoScale,
    roadProgress,
    router,
    textOpacity,
    textTranslateY,
  ]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const roadAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(roadProgress.value, [0, 0.5, 1], [0.25, 1, 0.25]),
    transform: [
      {
        translateX: interpolate(roadProgress.value, [0, 1], [-110, 110]),
      },
    ],
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#7D0000", "#C90000", "#8F0000", "#111111"]}
        locations={[0, 0.38, 0.72, 1]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.gradient}
      >
        <AnimatedView style={[styles.topGlow, glowAnimatedStyle]} />

        <View style={styles.bottomGlow} />

        <View style={styles.content}>
          <AnimatedView style={[styles.logoOuterRing, logoAnimatedStyle]}>
            <View style={styles.logoMiddleRing}>
              <View style={styles.logoContainer}>
                <Text style={styles.logoLetter}>V</Text>
                <View style={styles.logoAccent} />
              </View>
            </View>
          </AnimatedView>

          <AnimatedView style={textAnimatedStyle}>
            <Text style={styles.title}>
              Victory <Text style={styles.titleGold}>On Wheels</Text>
            </Text>

            <Text style={styles.tagline}>Service Beyond Expectations</Text>
          </AnimatedView>
        </View>

        <View style={styles.roadContainer}>
          <View style={styles.road} />

          <AnimatedView style={[styles.roadHighlight, roadAnimatedStyle]} />
        </View>

        <Text style={styles.footer}>Drive • Service • Confidence</Text>
      </LinearGradient>
    </View>
  );
}
