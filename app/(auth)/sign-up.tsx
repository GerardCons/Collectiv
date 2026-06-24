import { Field } from "@/components/form/field";
import { Button } from "@/components/ui/button";
import { colors, fontFamily, fontSizes, space } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MIN_PASSWORD_LENGTH = 8;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    displayName?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace("/(auth)/welcome");
  }

  function validate() {
    const next: typeof errors = {};
    if (!EMAIL_RE.test(email.trim())) next.email = "Enter a valid email.";
    if (password.length < MIN_PASSWORD_LENGTH)
      next.password = `At least ${MIN_PASSWORD_LENGTH} characters.`;
    if (!displayName.trim()) next.displayName = "Pick a display name.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // display_name is read by the handle_new_user() trigger, which creates
      // the profile row, derives a unique username, and seeds "Main".
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { display_name: displayName.trim() } },
      });
      if (error) throw error;

      // With email confirmation OFF, signUp returns a session and the auth
      // guards route us into onboarding. If confirmation is ON there is no
      // session yet — send the user to the OTP verify step.
      if (!data.session) {
        router.replace({ pathname: "/(auth)/verify", params: { email: email.trim() } });
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      Alert.alert("Couldn't create account", message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Pressable onPress={goBack} hitSlop={12} style={styles.close}>
            <Ionicons name="close" size={26} color={colors.text} />
          </Pressable>
          <View style={styles.close} />
        </View>

        <ScrollView
          contentContainerStyle={styles.body}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.heading}>Create your{"\n"}account</Text>
          <Text style={styles.subtext}>
            Already a collector?{" "}
            <Text style={styles.inlineLink} onPress={() => router.replace("/(auth)/sign-in")}>
              Log in
            </Text>
          </Text>

          <View style={styles.form}>
            <Field
              label="EMAIL"
              placeholder="alex@collectiv.app"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
            />

            <Field
              label="PASSWORD"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              helper={`At least ${MIN_PASSWORD_LENGTH} characters.`}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              textContentType="newPassword"
              rightAccessory={
                <Pressable onPress={() => setShowPassword((s) => !s)} hitSlop={8}>
                  <Text style={styles.showToggle}>
                    {showPassword ? "Hide" : "Show"}
                  </Text>
                </Pressable>
              }
            />

            <Field
              label="DISPLAY NAME"
              placeholder="alex.c"
              value={displayName}
              onChangeText={setDisplayName}
              error={errors.displayName}
              helper="This is what other collectors see."
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Button
              title="Create account"
              onPress={handleSubmit}
              loading={isSubmitting}
            />
          </View>

          <Text style={styles.fineprint}>
            We&apos;ll set up your &quot;Main&quot; collection automatically.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  close: { width: 40, height: 40, justifyContent: "center" },
  body: { padding: space["2xl"], paddingTop: space.sm },
  heading: {
    fontFamily: fontFamily.socialExtrabold,
    fontSize: fontSizes["2xl"],
    color: colors.text,
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  subtext: {
    fontFamily: fontFamily.body,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginTop: 8,
    marginBottom: space["2xl"],
  },
  inlineLink: { fontFamily: fontFamily.socialBold, color: colors.accent },
  form: { gap: space.lg },
  showToggle: { fontFamily: fontFamily.socialBold, color: colors.accent, fontSize: fontSizes.sm },
  fineprint: {
    fontFamily: fontFamily.body,
    fontSize: fontSizes.xs,
    color: colors.textTertiary,
    textAlign: "center",
    marginTop: space.xl,
    lineHeight: 17,
  },
});
