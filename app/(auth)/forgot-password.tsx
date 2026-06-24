import { Field } from "@/components/form/field";
import { Button } from "@/components/ui/button";
import { colors, fontFamily, fontSizes, space } from "@/constants/theme";
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
            <Ionicons name="chevron-back" size={26} color={colors.text} />
          </Pressable>
          <View style={styles.back} />
        </View>

        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          {sent ? (
            <View style={styles.sent}>
              <View style={styles.iconTile}>
                <Ionicons name="mail-outline" size={28} color={colors.accent} />
              </View>
              <Text style={styles.sentTitle}>Check your email</Text>
              <Text style={styles.sentBody}>
                We sent a reset link to{" "}
                <Text style={styles.strong}>{email.trim()}</Text>.{"\n\n"}
                Tap the link in the email to set a new password. The link
                expires in 1 hour.
              </Text>
              <Pressable onPress={back} style={styles.returnBtn}>
                <Text style={styles.returnBtnText}>Back to log in</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <View style={styles.iconTile}>
                <Ionicons name="lock-closed-outline" size={26} color={colors.accent} />
              </View>
              <Text style={styles.heading}>Reset your{"\n"}password</Text>
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

              <View style={styles.footer}>
                <Text style={styles.footerText}>Remembered it? </Text>
                <Pressable onPress={back}>
                  <Text style={styles.footerLink}>Log in</Text>
                </Pressable>
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
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  back: { width: 40, height: 40, justifyContent: "center" },
  body: { padding: space["2xl"], paddingTop: space.sm },
  iconTile: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: space.lg,
  },
  heading: {
    fontFamily: fontFamily.socialExtrabold,
    fontSize: fontSizes.xl,
    color: colors.text,
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  subtext: {
    fontFamily: fontFamily.body,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginTop: 8,
    marginBottom: space["2xl"],
    lineHeight: 20,
  },
  strong: { fontFamily: fontFamily.bodyBold, color: colors.text },
  form: { gap: space.lg },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: space.xl },
  footerText: { fontFamily: fontFamily.body, color: colors.textSecondary, fontSize: fontSizes.sm },
  footerLink: { fontFamily: fontFamily.socialBold, color: colors.accent, fontSize: fontSizes.sm },

  sent: { alignItems: "center", paddingTop: space["3xl"] },
  sentTitle: {
    fontFamily: fontFamily.socialExtrabold,
    fontSize: fontSizes.xl,
    color: colors.text,
    marginTop: space.md,
  },
  sentBody: {
    fontFamily: fontFamily.body,
    fontSize: fontSizes.base,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginTop: space.md,
  },
  returnBtn: { marginTop: space.xl },
  returnBtnText: { fontFamily: fontFamily.socialBold, color: colors.accent, fontSize: fontSizes.base },
});
