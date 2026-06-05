import { Field } from "@/components/form/field";
import { Button } from "@/components/ui/button";
import { colors, fontSize, spacing } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  function back() {
    if (router.canGoBack()) router.back();
    else router.replace("/(auth)/sign-in");
  }

  async function send() {
    const trimmed = email.trim();
    if (!trimmed) {
      setError("Enter your email address.");
      return;
    }
    setError(undefined);
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(trimmed, {
        // After Supabase verifies the token it will redirect to this deep link.
        // Add "collectiv://reset-password" to Supabase → Auth → URL Configuration → Redirect URLs.
        redirectTo: "collectiv://reset-password",
      });
      if (err) throw err;
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Pressable onPress={back} hitSlop={12} style={styles.back}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Reset password</Text>
          <View style={styles.back} />
        </View>

        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          {sent ? (
            <View style={styles.sent}>
              <View style={styles.sentIcon}>
                <Ionicons name="mail-outline" size={40} color={colors.accent} />
              </View>
              <Text style={styles.sentTitle}>Check your email</Text>
              <Text style={styles.sentBody}>
                We sent a reset link to{" "}
                <Text style={{ fontWeight: "700" }}>{email.trim()}</Text>.{"\n\n"}
                Tap the link in the email to set a new password. The link
                expires in 1 hour.
              </Text>
              <Pressable onPress={back} style={styles.returnBtn}>
                <Text style={styles.returnBtnText}>Back to log in</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <Text style={styles.heading}>Forgot password?</Text>
              <Text style={styles.subtext}>
                Enter the email you signed up with and we&apos;ll send a reset link.
              </Text>

              <View style={styles.form}>
                <Field
                  label="EMAIL"
                  placeholder="alex@collectiv.app"
                  value={email}
                  onChangeText={setEmail}
                  error={error}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  textContentType="emailAddress"
                />
                <Button title="Send reset link" onPress={send} loading={loading} />
              </View>
            </>
          )}
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  back: { width: 40, height: 40, justifyContent: "center" },
  headerTitle: { fontSize: fontSize.md, fontWeight: "700", color: colors.text },
  body: { padding: spacing.xl, gap: spacing.lg },
  heading: { fontSize: fontSize.xl, fontWeight: "800", color: colors.text },
  subtext: { fontSize: fontSize.md, color: colors.textSecondary, lineHeight: 22 },
  form: { gap: spacing.lg },

  sent: { alignItems: "center", gap: spacing.xl, paddingTop: spacing.xxl },
  sentIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  sentTitle: { fontSize: fontSize.xl, fontWeight: "800", color: colors.text },
  sentBody: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  returnBtn: { marginTop: spacing.md },
  returnBtnText: { color: colors.accent, fontSize: fontSize.md, fontWeight: "700" },
});
