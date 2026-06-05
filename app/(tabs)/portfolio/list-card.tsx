import { Field } from "@/components/form/field";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { useCard } from "@/hooks/use-cards";
import { useCreateListing } from "@/hooks/use-listings";
import { useProfile } from "@/hooks/use-profile";
import { dollarsToCents } from "@/lib/format";
import { cardPhotoUrl } from "@/lib/storage";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ListCardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: card, isLoading } = useCard(id);
  const { data: profile } = useProfile();
  const createListing = useCreateListing();

  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [shipping, setShipping] = useState("");
  const [priceError, setPriceError] = useState<string>();

  function cancel() {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/portfolio");
  }

  async function submit() {
    if (!card) return;
    const cents = dollarsToCents(price);
    if (cents === null) {
      setPriceError("Enter a price greater than 0.");
      return;
    }
    setPriceError(undefined);
    try {
      await createListing.mutateAsync({
        cardId: card.id,
        priceCents: cents,
        currency: "CAD",
        description: description.trim() || null,
        shippingInfo: shipping.trim() || null,
      });
      // First listing — prompt seller to set a pickup location for the map
      if (!profile?.pickup_location) {
        router.push("/(tabs)/portfolio/pickup-location" as never);
      } else {
        cancel();
      }
    } catch (err) {
      Alert.alert(
        "Couldn't list card",
        err instanceof Error ? err.message : "Something went wrong.",
      );
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Header leftText="Cancel" onBack={cancel} title="List for sale" />

        {isLoading || !card ? (
          <View style={styles.center}>
            <ActivityIndicator color={colors.accent} />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.body}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.cardRow}>
              <Image
                source={{ uri: cardPhotoUrl(card.primary_photo_path) }}
                style={styles.thumb}
                contentFit="cover"
              />
              <View style={styles.flex}>
                <Text style={styles.cardTitle}>{card.title}</Text>
                {card.set_name ? (
                  <Text style={styles.cardSub}>{card.set_name}</Text>
                ) : null}
              </View>
            </View>

            <View style={styles.form}>
              <Field
                label="PRICE (CAD)"
                value={price}
                onChangeText={setPrice}
                error={priceError}
                placeholder="24.00"
                keyboardType="decimal-pad"
                rightAccessory={<Text style={styles.currency}>$</Text>}
              />
              <Field
                label="DESCRIPTION (OPTIONAL)"
                value={description}
                onChangeText={setDescription}
                placeholder="Sleeved & top-loaded, open to offers."
                multiline
              />
              <Field
                label="PICKUP / SHIPPING (OPTIONAL)"
                value={shipping}
                onChangeText={setShipping}
                placeholder="Pickup in Whyte Ave; willing to ship."
                multiline
              />

              <Text style={styles.note}>
                Listing is buyer–seller coordination only — no in-app payments.
                Your card moves to the marketplace and is marked Listed.
              </Text>

              <Button
                title="List card"
                onPress={submit}
                loading={createListing.isPending}
                style={styles.submit}
              />
            </View>
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  body: { padding: spacing.xl, gap: spacing.xl },

  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  thumb: {
    width: 56,
    height: 75,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },
  cardTitle: { fontSize: fontSize.md, fontWeight: "700", color: colors.text },
  cardSub: { fontSize: fontSize.sm, color: colors.textSecondary },

  form: { gap: spacing.lg },
  currency: { fontSize: fontSize.md, color: colors.textSecondary },
  note: { fontSize: fontSize.xs, color: colors.textTertiary, lineHeight: 18 },
  submit: { marginTop: spacing.sm },
});
