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

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace("/(auth)/welcome");
  }

  async function handleSubmit() {
    if (!email.trim() || !password) {
      Alert.alert("Missing info", "Enter your email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      // On success, onAuthStateChange fires and the auth guards route us to the
      // tabs — we never navigate imperatively after sign-in.
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      Alert.alert("Couldn't sign in", message);
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
          <Text style={styles.headerTitle}>Log in</Text>
          <View style={styles.close} />
        </View>

        <ScrollView
          contentContainerStyle={styles.body}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.heading}>Welcome back</Text>
          <Text style={styles.subtext}>Pick up where you left off.</Text>

          <View style={styles.form}>
            <Field
              label="EMAIL"
              placeholder="alex@collectiv.app"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
            />

            <Field
              label="PASSWORD"
              placeholder="Your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              textContentType="password"
              rightAccessory={
                <Pressable onPress={() => setShowPassword((s) => !s)} hitSlop={8}>
                  <Text style={styles.showToggle}>
                    {showPassword ? "hide" : "show"}
                  </Text>
                </Pressable>
              }
            />

            <Pressable
              onPress={() =>
                Alert.alert(
                  "Forgot password",
                  "Password reset arrives in a later update.",
                )
              }
              hitSlop={8}
              style={styles.forgot}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Pressable>

            <Button
              title="Log in"
              onPress={handleSubmit}
              loading={isSubmitting}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.footerText}>New here? </Text>
          <Pressable onPress={() => router.replace("/(auth)/sign-up")}>
            <Text style={styles.footerLink}>Create account</Text>
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
  forgot: { alignSelf: "flex-end", marginTop: -spacing.sm },
  forgotText: { color: colors.accent, fontSize: fontSize.sm, fontWeight: "600" },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.lg,
  },
  footerText: { color: colors.textSecondary, fontSize: fontSize.sm },
  footerLink: { color: colors.accent, fontSize: fontSize.sm, fontWeight: "700" },
});
