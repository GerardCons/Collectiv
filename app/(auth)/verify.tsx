import { Button } from "@/components/ui/button";
import { colors, fontFamily, fontSizes, radii, space } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 45;

/**
 * Email OTP step. Only reached when sign-up returns NO session — i.e. the
 * Supabase project has email confirmation ON. With confirmation OFF (current
 * default) sign-up creates a session immediately and this screen is skipped.
 */
export default function VerifyScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const inputRef = useRef<TextInput>(null);
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  async function verify(token: string) {
    if (!email) return;
    setVerifying(true);
    try {
      // On success a session is created → (auth)/_layout routes into onboarding.
      const { error } = await supabase.auth.verifyOtp({ email, token, type: "signup" });
      if (error) throw error;
    } catch (err) {
      Alert.alert("Couldn't verify", err instanceof Error ? err.message : "Check the code and try again.");
      setCode("");
    } finally {
      setVerifying(false);
    }
  }

  function onChange(next: string) {
    const digits = next.replace(/\D/g, "").slice(0, CODE_LENGTH);
    setCode(digits);
    if (digits.length === CODE_LENGTH) verify(digits);
  }

  async function resend() {
    if (seconds > 0 || !email) return;
    try {
      const { error } = await supabase.auth.resend({ type: "signup", email });
      if (error) throw error;
      setSeconds(RESEND_SECONDS);
    } catch (err) {
      Alert.alert("Couldn't resend", err instanceof Error ? err.message : "Try again shortly.");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.back}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.body}>
        <View style={styles.iconTile}>
          <Ionicons name="mail-outline" size={26} color={colors.accent} />
        </View>
        <Text style={styles.heading}>Check your{"\n"}email</Text>
        <Text style={styles.subtext}>
          We sent a {CODE_LENGTH}-digit code to{"\n"}
          <Text style={styles.strong}>{email ?? "your email"}</Text>
        </Text>

        {/* Hidden input drives the visible boxes */}
        <Pressable style={styles.boxes} onPress={() => inputRef.current?.focus()}>
          {Array.from({ length: CODE_LENGTH }).map((_, i) => {
            const filled = i < code.length;
            return (
              <View
                key={i}
                style={[
                  styles.box,
                  { borderColor: filled ? colors.accent : colors.border, backgroundColor: filled ? colors.accent : colors.surface },
                ]}
              >
                <Text style={styles.boxText}>{code[i] ?? ""}</Text>
              </View>
            );
          })}
        </Pressable>
        <TextInput
          ref={inputRef}
          value={code}
          onChangeText={onChange}
          keyboardType="number-pad"
          maxLength={CODE_LENGTH}
          autoFocus
          style={styles.hiddenInput}
          textContentType="oneTimeCode"
        />

        <Button
          title="Verify"
          onPress={() => verify(code)}
          loading={verifying}
          disabled={code.length !== CODE_LENGTH}
        />

        <View style={styles.resendRow}>
          {seconds > 0 ? (
            <Text style={styles.resendMuted}>
              Resend available in 0:{seconds.toString().padStart(2, "0")}
            </Text>
          ) : (
            <Text style={styles.resendText}>
              Didn&apos;t get it?{" "}
              <Text style={styles.resendLink} onPress={resend}>
                Resend code
              </Text>
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: space.lg, paddingVertical: space.md },
  back: { width: 40, height: 40, justifyContent: "center" },
  body: { flex: 1, paddingHorizontal: space["2xl"] },
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
    marginTop: 10,
    lineHeight: 20,
    marginBottom: space["2xl"],
  },
  strong: { fontFamily: fontFamily.bodyBold, color: colors.text },
  boxes: { flexDirection: "row", justifyContent: "space-between", marginBottom: space["2xl"] },
  box: {
    width: 46,
    height: 56,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  boxText: { fontFamily: fontFamily.socialExtrabold, fontSize: fontSizes.xl, color: "#fff" },
  hiddenInput: { position: "absolute", opacity: 0, height: 1, width: 1 },
  resendRow: { alignItems: "center", marginTop: space.xl },
  resendMuted: { fontFamily: fontFamily.body, fontSize: fontSizes.sm, color: colors.textTertiary },
  resendText: { fontFamily: fontFamily.body, fontSize: fontSizes.sm, color: colors.textSecondary },
  resendLink: { fontFamily: fontFamily.socialBold, color: colors.accent },
});
