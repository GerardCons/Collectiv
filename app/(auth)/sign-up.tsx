import { Field } from "@/components/form/field";
import { Button } from "@/components/ui/button";
import { colors, fontSize, spacing } from "@/constants/theme";
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

      // With email confirmation OFF (Phase 1 plan), signUp returns a session and
      // onAuthStateChange routes us into the tabs. If a project has confirmation
      // ON, there is no session yet — tell the user instead of leaving them stuck.
      if (!data.session) {
        Alert.alert(
          "Almost there",
          "Check your email to confirm your account, then log in.",
        );
        router.replace("/(auth)/sign-in");
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
          <Text style={styles.headerTitle}>Create account</Text>
          <View style={styles.close} />
        </View>

        <ScrollView
          contentContainerStyle={styles.body}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.heading}>Welcome</Text>
          <Text style={styles.subtext}>
            We&apos;ll set up your &quot;Main&quot; collection automatically.
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
                    {showPassword ? "hide" : "show"}
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
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Pressable onPress={() => router.replace("/(auth)/sign-in")}>
            <Text style={styles.footerLink}>Log in</Text>
          </Pressable>
        </View>
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  close: { width: 40, height: 40, justifyContent: "center" },
  headerTitle: { fontSize: fontSize.md, fontWeight: "700", color: colors.text },
  body: { padding: spacing.xl, gap: spacing.xs },
  heading: { fontSize: fontSize.xl, fontWeight: "800", color: colors.text },
  subtext: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  form: { gap: spacing.lg },
  showToggle: { color: colors.textSecondary, fontSize: fontSize.sm },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.lg,
  },
  footerText: { color: colors.textSecondary, fontSize: fontSize.sm },
  footerLink: { color: colors.accent, fontSize: fontSize.sm, fontWeight: "700" },
});
