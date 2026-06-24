import { Bubble, ChatHeader, ChatInput, DayDivider, GroupBubble, PinnedCard, SystemNote } from "@/components/chat/chat-bits";
import { CounterSheet, DealMode, DoubleCheckModal, OfferSheet, ReviewSheet } from "@/components/chat/tx-sheets";
import { ActionSheet } from "@/components/ui/action-sheet";
import { Avatar } from "@/components/ui/avatar";
import { GradientThumb } from "@/components/home/gradient-thumb";
import { fontFamily } from "@/constants/theme";
import { CHAT_MORE_ACTIONS, DEAL_SEED, DM_SEED, getThread, GROUP_SEED, Msg } from "@/lib/chat-mock";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Role = "buyer" | "seller";
type Status = "chat" | "pending" | "countered" | "denied" | "complete";
type Overlay = null | "offer" | "review" | "counter-compose" | "counter-review" | "doublecheck";

export default function ChatRoom() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const thread = getThread(id ?? "t1");
  const isDeal = thread.kind === "deal";

  const seed = thread.kind === "group" ? GROUP_SEED : isDeal ? DEAL_SEED : DM_SEED;
  const [extra, setExtra] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [moreOpen, setMoreOpen] = useState(false);

  // Transaction state machine (deal threads).
  const [role, setRole] = useState<Role>("buyer");
  const [status, setStatus] = useState<Status>("chat");
  const [mode, setMode] = useState<DealMode>("buy");
  const [overlay, setOverlay] = useState<Overlay>(null);

  const messages = useMemo(() => [...seed, ...extra], [seed, extra]);

  function send() {
    const t = draft.trim();
    if (!t) return;
    setExtra((m) => [...m, { id: `x${m.length}`, me: true, text: t, time: "now" }]);
    setDraft("");
  }
  function sysMsg(text: string, me = false) {
    setExtra((m) => [...m, { id: `s${m.length}`, me, text, time: "now" }]);
  }

  // ── transitions ──
  function sendOffer(m: DealMode) {
    setMode(m);
    setStatus("pending");
    setRole("buyer");
    setOverlay(null);
    sysMsg(m === "buy" ? "Sent! 2 cards, $11.5k total 👍" : "Sent a trade offer 🔄 (+ $500 on my side)", true);
  }
  function accept() {
    setOverlay("doublecheck");
  }
  function confirmTransfer() {
    setStatus("complete");
    setOverlay(null);
  }
  function sendCounter() {
    setStatus("countered");
    setRole("buyer");
    setOverlay(null);
    sysMsg("Marcus countered your offer ↩");
  }
  function deny() {
    setStatus("denied");
    setOverlay(null);
  }

  // Pinned card config from role + status.
  const pinned = (() => {
    if (status === "complete") return { tag: "TRANSFERRED", tagColor: colors.success, cta: { label: "✓ Complete", color: colors.success, onPress: () => {} } };
    if (status === "denied") return { tag: "DISCUSSING", tagColor: colors.fgTertiary, cta: null };
    if (status === "pending") {
      return role === "seller"
        ? { tag: "BUYER CONFIRMED PURCHASE", tagColor: colors.success, cta: { label: "Review ›", color: colors.success, onPress: () => setOverlay("review") } }
        : { tag: "AWAITING SELLER CONFIRM", tagColor: colors.warning, cta: { label: "Pending…", color: colors.warning, onPress: () => {} }, dim: true };
    }
    if (status === "countered") {
      return role === "buyer"
        ? { tag: "SELLER COUNTERED", tagColor: colors.primary, cta: { label: "Review ›", color: colors.primary, onPress: () => setOverlay("counter-review") } }
        : { tag: "DISCUSSING", tagColor: colors.fgTertiary, cta: null };
    }
    // chat
    return role === "buyer"
      ? { tag: "DISCUSSING", tagColor: colors.fgTertiary, cta: { label: "", color: colors.primary, onPress: () => setOverlay("offer"), circleIcon: "checkmark" as const } }
      : { tag: "DISCUSSING", tagColor: colors.fgTertiary, cta: null };
  })();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgBase }]} edges={["top"]}>
      <ChatHeader thread={thread} onBack={() => (router.canGoBack() ? router.back() : router.replace("/chat"))} onMore={() => setMoreOpen(true)} />

      {/* Listing / deal context */}
      {isDeal ? (
        <>
          <PinnedCard tag={pinned.tag} tagColor={pinned.tagColor} cta={pinned.cta} dim={"dim" in pinned ? pinned.dim : false} />
          {/* role toggle so you can drive both sides */}
          {status !== "complete" && status !== "denied" ? (
            <Pressable style={styles.roleToggle} onPress={() => setRole((r) => (r === "buyer" ? "seller" : "buyer"))}>
              <Ionicons name="swap-horizontal" size={11} color={colors.fgTertiary} />
              <Text style={[styles.roleText, { color: colors.fgTertiary }]}>Viewing as {role === "buyer" ? "Buyer" : "Seller"} · tap to switch</Text>
            </Pressable>
          ) : null}
        </>
      ) : thread.listing ? (
        <View style={[styles.context, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
          <GradientThumb accent={thread.listing.color} width={40} height={56} radius={7} />
          <View style={styles.flex}>
            <Text style={[styles.ctxTag, { color: colors.fgTertiary }]}>DISCUSSING</Text>
            <Text style={[styles.ctxTitle, { color: colors.fgPrimary }]} numberOfLines={1}>{thread.listing.title}</Text>
            <Text style={[styles.ctxPrice, { color: colors.primary }]}>{thread.listing.price}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.fgTertiary} />
        </View>
      ) : null}

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={8}>
        <ScrollView contentContainerStyle={styles.thread} keyboardShouldPersistTaps="handled">
          <DayDivider label="TODAY" />
          {messages.map((m) => (thread.kind === "group" ? <GroupBubble key={m.id} msg={m} /> : <Bubble key={m.id} me={m.me} time={m.time}>{m.text}</Bubble>))}

          {isDeal && status === "pending" ? (
            <SystemNote tone="amber" title="⏱ Confirmation sent">
              Waiting for {role === "seller" ? "you" : "Marcus"} to verify 1 item · $11,500
            </SystemNote>
          ) : null}
          {isDeal && status === "complete" ? (
            <SystemNote tone="green" title={mode === "buy" ? "✅ Transfer complete!" : "✅ Trade complete!"}>
              {mode === "buy" ? "2 cards added to the buyer's portfolio · $11,500 received" : "Curry + Morant added · LeBron sent · +$500"}
            </SystemNote>
          ) : null}
          {isDeal && status === "denied" ? (
            <>
              <SystemNote tone="red" title={mode === "buy" ? "🚫 Offer declined" : "🚫 Trade declined"}>
                The card is still listed — you can send a new {mode === "buy" ? "offer" : "trade"}.
              </SystemNote>
              <Pressable style={[styles.newOffer, { backgroundColor: colors.primary }]} onPress={() => { setStatus("chat"); setRole("buyer"); setOverlay("offer"); }}>
                <Text style={styles.newOfferText}>Send a new {mode === "buy" ? "offer" : "trade"}</Text>
              </Pressable>
            </>
          ) : null}
        </ScrollView>

        <ChatInput value={draft} onChangeText={setDraft} onSend={send} />
      </KeyboardAvoidingView>

      {/* ··· menu */}
      <ActionSheet
        visible={moreOpen}
        onClose={() => setMoreOpen(false)}
        header={{ title: thread.name, subtitle: thread.online ? "✓ Verified · Active now" : `@${thread.handle ?? ""}`, avatar: <Avatar name={thread.name} size={46} color={thread.color} /> }}
        actions={CHAT_MORE_ACTIONS.map((a) => ({
          icon: a.icon as keyof typeof Ionicons.glyphMap,
          label: a.label,
          sub: a.sub,
          danger: "danger" in a ? a.danger : false,
          onPress: () => {
            if (a.label === "Create an Offer") {
              setRole("buyer");
              setStatus("chat");
              setOverlay("offer");
            } else if (a.label === "View Profile") {
              router.push({ pathname: "/profile/[id]", params: { id: thread.id } });
            }
          },
        }))}
      />

      {/* Transaction sheets */}
      <OfferSheet visible={overlay === "offer"} onClose={() => setOverlay(null)} onSend={sendOffer} initialMode={mode} />
      <ReviewSheet visible={overlay === "review"} onClose={() => setOverlay(null)} mode={mode} onAccept={accept} onCounter={() => setOverlay("counter-compose")} onDeny={deny} />
      <CounterSheet visible={overlay === "counter-compose"} onClose={() => setOverlay(null)} mode={mode} composing onSend={sendCounter} onAccept={() => {}} onDecline={deny} />
      <CounterSheet visible={overlay === "counter-review"} onClose={() => setOverlay(null)} mode={mode} composing={false} onSend={() => { setRole("seller"); setOverlay("counter-compose"); }} onAccept={accept} onDecline={deny} />
      <DoubleCheckModal visible={overlay === "doublecheck"} onClose={() => setOverlay(null)} mode={mode} onConfirm={confirmTransfer} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1, minWidth: 0 },
  roleToggle: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, paddingVertical: 6 },
  roleText: { fontFamily: fontFamily.socialBold, fontSize: 10 },
  context: { flexDirection: "row", alignItems: "center", gap: 11, marginHorizontal: 14, marginTop: 10, marginBottom: 4, padding: 9, paddingHorizontal: 11, borderRadius: 14, borderWidth: 1 },
  ctxTag: { fontFamily: fontFamily.socialExtrabold, fontSize: 9, letterSpacing: 0.4 },
  ctxTitle: { fontFamily: fontFamily.socialBold, fontSize: 12.5, marginTop: 1 },
  ctxPrice: { fontFamily: fontFamily.socialExtrabold, fontSize: 11.5, marginTop: 1 },
  thread: { padding: 14, paddingTop: 12 },
  newOffer: { alignSelf: "center", marginTop: 6, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 999 },
  newOfferText: { fontFamily: fontFamily.socialBold, fontSize: 13, color: "#fff" },
});
