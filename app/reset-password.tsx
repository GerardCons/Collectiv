import { Button } from "@/components/ui/button";
import { Field } from "@/components/form/field";
import { colors, fontFamily, fontSizes, space } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Deep-link target for password reset emails.
 * Supabase redirects to collectiv://reset-password?code=<PKCE code>
 * after the user taps the link in their email.
 *
 * Setup required in Supabase Dashboard:
 *   Auth → URL Configuration → Redirect URLs → add "collectiv://reset-password"
 */
export default function ResetPasswordScreen() {
  const { code } = useLocalSearchParams<{ code?: string }>();
  const [ready, setReady] = useState(false);
  const [exchanging, setExchanging] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  // Exchange the PKCE code for a session so we can call updateUser
  useEffect(() => {
    if (!code) return;
    setExchanging(true);
    supabase.auth
      .exchangeCodeForSession(code)
      .then(({ error }) => {
        if (error) {
          Alert.alert(
            "Link expired",
            "This reset link has expired or already been used. Request a new one.",
            [{ text: "OK", onPress: () => router.replace("/(auth)/forgot-password" as never) }],
          );
        } else {
          setReady(true);
        }
      })
      .finally(() => setExchanging(false));
  }, [code]);

  async function save() {
    if (password.length < 8) {
      Alert.alert("Too short", "Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      Alert.alert("Mismatch", "Passwords don't match.");
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      Alert.alert("Password updated", "You're all set — log in with your new password.", [
        { text: "OK", onPress: () => router.replace("/(auth)/sign-in") },
      ]);
    } catch (err) {
      Alert.alert("Error", err instanceof Error ? err.message : "Couldn't update password.");
    } finally {
      setSaving(false);
    }
  }

  if (!code || exchanging) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          {!code ? (
            <>
              <Ionicons name="link-outline" size={48} color={colors.textTertiary} />
              <Text style={styles.hint}>
                Open this screen via the reset link in your email.
              </Text>
            </>
          ) : (
            <ActivityIndicator color={colors.accent} />
          )}
        </View>
      </SafeAreaView>
    );
  }

  if (!ready) return null;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.body}>
          <View style={styles.iconTile}>
            <Ionicons name="lock-open-outline" size={26} color={colors.accent} />
          </View>
          <Text style={styles.heading}>Set new password</Text>
          <Text style={styles.subtext}>Must be at least 8 characters.</Text>

          <View style={styles.form}>
            <Field
              label="NEW PASSWORD"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              textContentType="newPassword"
            />
            <Field
              label="CONFIRM PASSWORD"
              placeholder="••••••••"
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry
              autoCapitalize="none"
              textContentType="newPassword"
            />
            <Button title="Update password" onPress={save} loading={saving} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: space.lg, padding: space.xl },
  hint: { fontFamily: fontFamily.body, fontSize: fontSizes.sm, color: colors.textSecondary, textAlign: "center" },
  body: { flex: 1, padding: space["2xl"], gap: space.xl, justifyContent: "center" },
  iconTile: {
    alignSelf: "center",
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontFamily: fontFamily.socialExtrabold,
    fontSize: fontSizes.xl,
    color: colors.text,
    textAlign: "center",
  },
  subtext: {
    fontFamily: fontFamily.body,
    fontSize: fontSizes.base,
    color: colors.textSecondary,
    textAlign: "center",
  },
  form: { gap: space.lg },
});
