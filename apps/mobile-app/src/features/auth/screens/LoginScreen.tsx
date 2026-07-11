import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppButton } from "../../../components/buttons";
import { styles } from "./LoginScreen.styles";

const PHONE_NUMBER_LENGTH = 10;

export function LoginScreen() {
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handlePhoneNumberChange = (value: string) => {
    const cleanedValue = value.replace(/\D/g, "").slice(0, PHONE_NUMBER_LENGTH);

    setPhoneNumber(cleanedValue);

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleContinue = () => {
    if (phoneNumber.length !== PHONE_NUMBER_LENGTH) {
      setErrorMessage("Enter a valid 10-digit mobile number.");
      return;
    }

    setErrorMessage("");

    router.push({
      pathname: "/verify-otp",
      params: {
        phoneNumber: `+91${phoneNumber}`,
      },
    });
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/onboarding");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["left", "right"]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient
            colors={["#870000", "#C90000", "#9B0000"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroSection}
          >
            <View style={styles.heroGlowTop} />
            <View style={styles.heroGlowBottom} />

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={12}
              onPress={handleBack}
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.backButtonPressed,
              ]}
            >
              <Text style={styles.backArrow}>‹</Text>
            </Pressable>

            <View style={styles.brandArea}>
              <View style={styles.brandOuter}>
                <View style={styles.brandInner}>
                  <Text style={styles.brandLetter}>V</Text>
                  <View style={styles.brandAccent} />
                </View>
              </View>

              <Text style={styles.heroTitle}>Victory On Wheels</Text>

              <Text style={styles.heroSubtitle}>
                Service Beyond Expectations
              </Text>
            </View>
          </LinearGradient>

          <View style={styles.formCard}>
            <Text style={styles.formEyebrow}>Customer Access</Text>

            <Text style={styles.title}>Welcome Back</Text>

            <Text style={styles.subtitle}>
              Enter your registered mobile number to receive a secure OTP.
            </Text>

            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Mobile Number</Text>

              <View
                style={[
                  styles.phoneField,
                  isFocused && styles.phoneFieldFocused,
                  Boolean(errorMessage) && styles.phoneFieldError,
                ]}
              >
                <View style={styles.countryCodeBox}>
                  <Text style={styles.countryCodeText}>+91</Text>
                </View>

                <TextInput
                  value={phoneNumber}
                  onChangeText={handlePhoneNumberChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Enter 10-digit number"
                  placeholderTextColor="#8B8B8B"
                  keyboardType="number-pad"
                  maxLength={PHONE_NUMBER_LENGTH}
                  returnKeyType="done"
                  onSubmitEditing={handleContinue}
                  selectionColor="#C90000"
                  style={styles.phoneInput}
                />
              </View>

              {errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
              ) : null}
            </View>

            <View style={styles.buttonContainer}>
              <AppButton icon="arrow-right" onPress={handleContinue}>
                Send OTP
              </AppButton>
            </View>

            <Text style={styles.termsText}>
              By continuing, you agree to our{" "}
              <Text style={styles.termsHighlight}>Terms of Service</Text> and{" "}
              <Text style={styles.termsHighlight}>Privacy Policy</Text>.
            </Text>
          </View>

          <View style={styles.benefitSection}>
            <Text style={styles.benefitTitle}>
              Everything your vehicle needs
            </Text>

            <View style={styles.benefitGrid}>
              <View style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <Text style={styles.benefitIconText}>🚘</Text>
                </View>

                <Text style={styles.benefitText}>Manage Your Garage</Text>
              </View>

              <View style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <Text style={styles.benefitIconText}>🛠️</Text>
                </View>

                <Text style={styles.benefitText}>Track Live Service</Text>
              </View>

              <View style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <Text style={styles.benefitIconText}>₹</Text>
                </View>

                <Text style={styles.benefitText}>Secure Payments</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
