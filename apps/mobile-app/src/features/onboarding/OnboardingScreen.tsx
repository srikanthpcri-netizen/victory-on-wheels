import { useRef, useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppButton } from "../../components/buttons";
import { colors } from "../../theme";
import { onboardingData, type OnboardingItem } from "./onboardingData";
import { styles } from "./OnboardingScreen.styles";

export function OnboardingScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList<OnboardingItem>>(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  const isFirstSlide = currentIndex === 0;
  const isLastSlide = currentIndex === onboardingData.length - 1;

  const goToLogin = () => {
    router.replace("/login");
  };

  const goToNextSlide = () => {
    if (isLastSlide) {
      goToLogin();
      return;
    }

    const nextIndex = currentIndex + 1;

    flatListRef.current?.scrollToIndex({
      index: nextIndex,
      animated: true,
    });

    setCurrentIndex(nextIndex);
  };

  const goToPreviousSlide = () => {
    if (isFirstSlide) {
      return;
    }

    const previousIndex = currentIndex - 1;

    flatListRef.current?.scrollToIndex({
      index: previousIndex,
      animated: true,
    });

    setCurrentIndex(previousIndex);
  };

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const slideWidth = event.nativeEvent.layoutMeasurement.width;
    const offsetX = event.nativeEvent.contentOffset.x;
    const nextIndex = Math.round(offsetX / slideWidth);

    setCurrentIndex(nextIndex);
  };

  const renderSlide = ({ item }: { item: OnboardingItem }) => {
    const isCheckIcon = item.icon === "✓";

    return (
      <View style={styles.slide}>
        <View style={styles.visualArea}>
          <View
            style={[
              styles.visualBackdrop,
              {
                backgroundColor: item.secondaryAccent,
              },
            ]}
          />

          <View style={styles.visualRingLarge}>
            <View style={styles.visualRingSmall}>
              <View
                style={[
                  styles.visualIconContainer,
                  {
                    backgroundColor: item.accent,
                  },
                ]}
              >
                <Text
                  style={isCheckIcon ? styles.checkIcon : styles.visualIcon}
                >
                  {item.icon}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.miniBadgeLeft}>
            <Text style={styles.miniBadgeTitle}>Trusted Service</Text>
            <Text style={styles.miniBadgeValue}>Verified Updates</Text>
          </View>

          <View style={styles.miniBadgeRight}>
            <Text style={styles.miniBadgeTitle}>Premium Care</Text>
            <Text style={styles.miniBadgeValue}>Transparent Pricing</Text>
          </View>
        </View>

        <View style={styles.contentArea}>
          <Text style={styles.eyebrow}>{item.eyebrow}</Text>

          <Text style={styles.title}>{item.title}</Text>

          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <View style={styles.brandContainer}>
            <View style={styles.brandMark}>
              <Text style={styles.brandLetter}>V</Text>
            </View>

            <View style={styles.brandTextContainer}>
              <Text style={styles.brandTitle}>Victory On Wheels</Text>

              <Text style={styles.brandSubtitle}>
                SERVICE BEYOND EXPECTATIONS
              </Text>
            </View>
          </View>

          <Text
            accessibilityRole="button"
            onPress={goToLogin}
            style={styles.skipText}
          >
            Skip
          </Text>
        </View>

        <FlatList
          ref={flatListRef}
          data={onboardingData}
          keyExtractor={(item) => item.id}
          renderItem={renderSlide}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          style={styles.slider}
          onMomentumScrollEnd={handleMomentumScrollEnd}
        />

        <View style={styles.footer}>
          <View style={styles.pagination}>
            {onboardingData.map((item, index) => (
              <View
                key={item.id}
                style={[styles.dot, index === currentIndex && styles.activeDot]}
              />
            ))}
          </View>

          <View style={styles.footerRow}>
            {!isFirstSlide ? (
              <Text
                accessibilityRole="button"
                onPress={goToPreviousSlide}
                style={styles.previousButton}
              >
                <Text style={styles.previousButtonText}>‹</Text>
              </Text>
            ) : null}

            <View style={styles.nextButtonContainer}>
              <AppButton
                onPress={goToNextSlide}
                icon={isLastSlide ? "arrow-right" : undefined}
              >
                {isLastSlide ? "Get Started" : "Continue"}
              </AppButton>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
