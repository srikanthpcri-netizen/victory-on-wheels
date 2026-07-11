import { useEffect, useMemo, useRef, useState } from "react";
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
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppButton } from "../../../components/buttons";
import { styles } from "./OtpVerificationScreen.styles";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

export function OtpVerificationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ phoneNumber?: string }>();

  const phoneNumber = useMemo(() => {
    return params.phoneNumber ?? "";
  }, [params.phoneNumber]);

  const inputRefs = useRef<Array<TextInput | null>>([]);

  const [otp, setOtp] = useState<string[]>(
    Array.from({ length: OTP_LENGTH }, () => ""),
  );
  const [focusedIndex, setFocusedIndex] = useState<number | null>(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((current) => current - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleOtpChange = (value: string, index: number) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    const nextOtp = [...otp];
    nextOtp[index] = digit;
    setOtp(nextOtp);

    if (errorMessage) {
      setErrorMessage("");
    }

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== OTP_LENGTH) {
      setErrorMessage("Enter the complete 6-digit OTP.");
      return;
    }

    setErrorMessage("");

    console.log("OTP ready for verification:", enteredOtp);
  };

  const handleResendOtp = () => {
    if (secondsLeft > 0) {
      return;
    }

    setOtp(Array.from({ length: OTP_LENGTH }, () => ""));
    setErrorMessage("");
    setSecondsLeft(RESEND_SECONDS);

    inputRefs.current[0]?.focus();

    console.log("Resend OTP for:", phoneNumber);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/login");
  };

  const maskedPhoneNumber = phoneNumber
    ? `${phoneNumber.slice(0, 3)}****${phoneNumber.slice(-3)}`
    : "your mobile number";

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

            <View style={styles.heroContent}>
              <View style={styles.heroIcon}>
                <Text style={styles.heroIconText}>OTP</Text>
              </View>

              <Text style={styles.heroTitle}>Verify Your Number</Text>

              <Text style={styles.heroSubtitle}>Secure Customer Access</Text>
            </View>
          </LinearGradient>

          <View style={styles.formCard}>
            <Text style={styles.eyebrow}>OTP Verification</Text>

            <Text style={styles.title}>Enter Verification Code</Text>

            <Text style={styles.description}>
              We sent a 6-digit code to{" "}
              <Text style={styles.phoneNumber}>{maskedPhoneNumber}</Text>.
            </Text>

            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={`otp-${index}`}
                  ref={(reference) => {
                    inputRefs.current[index] = reference;
                  }}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={({ nativeEvent }) =>
                    handleKeyPress(nativeEvent.key, index)
                  }
                  onFocus={() => setFocusedIndex(index)}
                  onBlur={() => setFocusedIndex(null)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                  selectionColor="#C90000"
                  style={[
                    styles.otpInput,
                    focusedIndex === index && styles.otpInputFocused,
                    Boolean(errorMessage) && styles.otpInputError,
                  ]}
                />
              ))}
            </View>

            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            <View style={styles.buttonContainer}>
              <AppButton icon="shield-check" onPress={handleVerifyOtp}>
                Verify OTP
              </AppButton>
            </View>

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>
                Didn&apos;t receive the code?
              </Text>

              {secondsLeft > 0 ? (
                <Text style={styles.timerText}>
                  Resend OTP in 00:
                  {String(secondsLeft).padStart(2, "0")}
                </Text>
              ) : (
                <Text
                  accessibilityRole="button"
                  onPress={handleResendOtp}
                  style={styles.resendAction}
                >
                  Resend OTP
                </Text>
              )}
            </View>
          </View>

          <Text style={styles.secureNote}>
            Your OTP is private. Victory On Wheels will never ask you to share
            it over calls, messages, or email.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
