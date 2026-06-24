import { GradientThumb } from "@/components/home/gradient-thumb";
import { fontFamily } from "@/constants/theme";
import { DealCard, SELLER_CARDS, TRADE_CARDS } from "@/lib/chat-mock";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export type DealMode = "buy" | "trade";

function SheetOverlay({ visible, onClose, children }: { visible: boolean; onClose: () => void; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={[styles.backdrop, { backgroundColor: colors.overlay }]} onPress={onClose} />
        <View style={[styles.sheet, { backgroundColor: colors.bgBase }]}>
          <View style={[styles.handle, { backgroundColor: colors.fgTertiary }]} />
          {children}
        </View>
      </View>
    </Modal>
  );
}

function CardRow({ card, onToggle, valueLabel }: { card: DealCard; onToggle?: () => void; valueLabel?: string }) {
  const { colors } = useTheme();
  return (
    <Pressable style={[styles.cardRow, { borderBottomColor: colors.borderDefault }]} onPress={onToggle} disabled={!onToggle}>
      <GradientThumb accent={card.color} width={30} height={42} radius={5} />
      <View style={styles.flex}>
        <Text style={[styles.cardName, { color: colors.fgPrimary }]} numberOfLines={1}>{card.name}</Text>
        <Text style={[styles.cardSub, { color: colors.fgTertiary }]}>{card.grade} · {valueLabel ?? `est. ${card.value}`}</Text>
      </View>
      {onToggle ? (
        <View style={[styles.check, card.on ? { backgroundColor: colors.primary, borderColor: colors.primary } : { borderColor: colors.borderDefault }]}>
          {card.on ? <Ionicons name="checkmark" size={11} color="#fff" /> : null}
        </View>
      ) : null}
    </Pressable>
  );
}

// ── Make an Offer (buyer) ──
export function OfferSheet({ visible, onClose, onSend, initialMode = "buy" }: { visible: boolean; onClose: () => void; onSend: (mode: DealMode) => void; initialMode?: DealMode }) {
  const { colors } = useTheme();
  const [mode, setMode] = useState<DealMode>(initialMode);
  const [trade, setTrade] = useState(TRADE_CARDS);
  const [addOpen, setAddOpen] = useState(false);

  function toggleTrade(id: string) {
    setTrade((prev) => prev.map((c) => (c.id === id ? { ...c, on: !c.on } : c)));
  }

  return (
    <SheetOverlay visible={visible} onClose={onClose}>
      <View style={styles.headRow}>
        <Text style={[styles.title, { color: colors.fgPrimary }]}>Make an Offer</Text>
        <Pressable onPress={onClose} style={[styles.closeX, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
          <Ionicons name="close" size={12} color={colors.fgSecondary} />
        </Pressable>
      </View>

      <View style={[styles.segment, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
        {(["buy", "trade"] as DealMode[]).map((m) => {
          const on = m === mode;
          return (
            <Pressable key={m} onPress={() => setMode(m)} style={[styles.segItem, on && { backgroundColor: colors.bgBase }]}>
              <Text style={[styles.segText, { color: on ? colors.primary : colors.fgTertiary }]}>{m === "buy" ? "💵 Buy with cash" : "🔄 Offer a trade"}</Text>
            </Pressable>
          );
        })}
      </View>

      {mode === "buy" ? (
        <View style={styles.body}>
          <View style={styles.discRow}>
            <GradientThumb accent={colors.primary} width={34} height={48} radius={6} />
            <View style={styles.flex}>
              <Text style={[styles.cardName, { color: colors.fgPrimary }]}>LeBron James &apos;03 Chrome RC</Text>
              <Text style={[styles.cardSub, { color: colors.fgTertiary }]}>PSA 10 · listed $12,500</Text>
            </View>
          </View>
          <View style={styles.offerHead}>
            <Text style={[styles.offerLabel, { color: colors.fgSecondary }]}>Your offer</Text>
            <Pressable style={[styles.addCards, { backgroundColor: colors.primaryMuted, borderColor: colors.primary }]} onPress={() => setAddOpen(true)}>
              <Ionicons name="add" size={12} color={colors.primary} />
              <Text style={[styles.addCardsText, { color: colors.primary }]}>Add more cards</Text>
            </Pressable>
          </View>
          <View style={[styles.amountBox, { backgroundColor: colors.bgBase, borderColor: colors.primary }]}>
            <Text style={[styles.amountSign, { color: colors.primary }]}>$</Text>
            <Text style={[styles.amount, { color: colors.fgPrimary }]}>11,500</Text>
            <Text style={[styles.belowAsk, { color: colors.success }]}>8% below ask</Text>
          </View>
        </View>
      ) : (
        <View style={styles.body}>
          <Text style={[styles.offerLabel, { color: colors.fgSecondary, marginBottom: 4 }]}>Cards from your collection</Text>
          {trade.map((c) => (
            <CardRow key={c.id} card={c} onToggle={() => toggleTrade(c.id)} />
          ))}
          <View style={styles.cashRow}>
            <Text style={[styles.offerLabel, { color: colors.fgSecondary }]}>+ Add cash</Text>
            <View style={[styles.cashBox, { backgroundColor: colors.bgBase, borderColor: colors.borderDefault }]}>
              <Text style={[styles.cashSign, { color: colors.primary }]}>$</Text>
              <Text style={[styles.cash, { color: colors.fgPrimary }]}>500</Text>
            </View>
            <Text style={[styles.side, { color: colors.fgTertiary }]}>Your side ≈ $2,570</Text>
          </View>
        </View>
      )}

      <View style={styles.cta}>
        <Pressable style={[styles.ctaBtn, { backgroundColor: colors.primary }]} onPress={() => onSend(mode)}>
          <Text style={styles.ctaText}>{mode === "buy" ? "Send offer · $11,500" : "Send trade offer →"}</Text>
        </Pressable>
      </View>

      {/* Add-from-listings dialog */}
      <Modal visible={addOpen} transparent animationType="fade" statusBarTranslucent onRequestClose={() => setAddOpen(false)}>
        <View style={styles.dialogRoot}>
          <Pressable style={[styles.backdrop, { backgroundColor: "rgba(14,13,12,0.45)" }]} onPress={() => setAddOpen(false)} />
          <View style={[styles.dialog, { backgroundColor: colors.bgBase }]}>
            <View style={[styles.dialogHead, { borderBottomColor: colors.borderDefault }]}>
              <Text style={[styles.dialogTitle, { color: colors.fgPrimary }]}>Add from Marcus&apos;s listings</Text>
              <Text style={[styles.dialogSub, { color: colors.fgTertiary }]}>Bundle more cards into this offer</Text>
            </View>
            {SELLER_CARDS.slice(1).map((c) => (
              <CardRow key={c.id} card={c} valueLabel={`listed ${c.value}`} onToggle={() => {}} />
            ))}
            <View style={styles.dialogCta}>
              <Pressable style={[styles.dialogCancel, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]} onPress={() => setAddOpen(false)}>
                <Text style={[styles.dialogCancelText, { color: colors.fgSecondary }]}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.dialogAdd, { backgroundColor: colors.primary }]} onPress={() => setAddOpen(false)}>
                <Text style={styles.dialogAddText}>Add 1 card</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SheetOverlay>
  );
}

// ── Review (seller) ──
export function ReviewSheet({ visible, onClose, mode, onAccept, onCounter, onDeny }: { visible: boolean; onClose: () => void; mode: DealMode; onAccept: () => void; onCounter: () => void; onDeny: () => void }) {
  const { colors } = useTheme();
  return (
    <SheetOverlay visible={visible} onClose={onClose}>
      <View style={styles.reviewHead}>
        <Text style={[styles.title, { color: colors.fgPrimary }]}>Review Jake&apos;s {mode === "buy" ? "offer" : "trade"}</Text>
        <Text style={[styles.reviewSub, { color: colors.fgTertiary }]}>{mode === "buy" ? "2 cards · offered $11,500 total" : "Wants your LeBron · offers 2 cards + $500"}</Text>
      </View>
      <ScrollView style={styles.reviewBody}>
        {mode === "buy" ? (
          <>
            <SecLabel>Cards they&apos;re buying</SecLabel>
            <ReviewLine name="LeBron James — '03 Chrome RC" sub="PSA 10 · listed $12,500" val="$10,500" />
            <ReviewLine name="Kobe Bryant — '96 Chrome RC" sub="PSA 8 · listed $2,100" val="$1,000" />
            <TotalRow label="Total offer (cash):" value="$11,500" valueColor={colors.primary} note="2 cards leave your portfolio" />
          </>
        ) : (
          <>
            <SecLabel>You give</SecLabel>
            <ReviewLine name="LeBron James — '03 Chrome RC" sub="PSA 10 · your listing $12,500" val="–" valColor={colors.fgTertiary} />
            <SecLabel>You receive</SecLabel>
            <ReviewLine name="Stephen Curry — '09 Chrome RC" sub="PSA 9 · est. $1,450" val="+" valColor={colors.success} />
            <ReviewLine name="Ja Morant — '19 Prizm RC" sub="PSA 10 · est. $620" val="+" valColor={colors.success} />
            <TotalRow label="+ Cash on their side:" value="$500" valueColor={colors.success} note="≈ $2,570 their value" />
          </>
        )}
      </ScrollView>
      <View style={styles.reviewCta}>
        <Pressable style={[styles.acceptBtn, { backgroundColor: colors.success }]} onPress={onAccept}>
          <Text style={styles.acceptText}>{mode === "buy" ? "Accept Offer" : "Accept Trade"}</Text>
        </Pressable>
        <View style={styles.reviewRow2}>
          <Pressable style={[styles.outlineBtn, { borderColor: colors.borderDefault }]} onPress={onCounter}>
            <Text style={[styles.outlineText, { color: colors.fgSecondary }]}>Counter</Text>
          </Pressable>
          <Pressable style={[styles.outlineBtn, { borderColor: colors.error }]} onPress={onDeny}>
            <Text style={[styles.outlineText, { color: colors.error }]}>{mode === "buy" ? "Deny Offer" : "Deny Trade"}</Text>
          </Pressable>
        </View>
      </View>
    </SheetOverlay>
  );
}

// ── Counter (seller composes / buyer receives) ──
export function CounterSheet({ visible, onClose, mode, composing, onSend, onAccept, onDecline }: { visible: boolean; onClose: () => void; mode: DealMode; composing: boolean; onSend: () => void; onAccept: () => void; onDecline: () => void }) {
  const { colors } = useTheme();
  return (
    <SheetOverlay visible={visible} onClose={onClose}>
      <View style={styles.reviewHead}>
        <Text style={[styles.title, { color: colors.fgPrimary }]}>{composing ? `Counter Jake's ${mode === "buy" ? "offer" : "trade"}` : "Marcus countered"}</Text>
        <Text style={[styles.reviewSub, { color: colors.fgTertiary }]}>{composing ? "Propose new terms — Jake can accept or counter back" : "Review the new terms and respond"}</Text>
      </View>
      <ScrollView style={styles.reviewBody}>
        {mode === "buy" ? (
          <View style={[styles.counterCompare, { borderTopColor: colors.borderDefault, borderBottomColor: colors.borderDefault }]}>
            <View>
              <Text style={[styles.cardSub, { color: colors.fgTertiary }]}>Their offer</Text>
              <Text style={[styles.strike, { color: colors.fgSecondary }]}>$11,500</Text>
            </View>
            <Ionicons name="arrow-forward" size={16} color={colors.fgTertiary} />
            <View style={{ alignItems: "flex-end" }}>
              <Text style={[styles.counterLabel, { color: colors.primary }]}>{composing ? "Your counter" : "Counter price"}</Text>
              <Text style={[styles.counterPrice, { color: colors.primary }]}>$12,000</Text>
            </View>
          </View>
        ) : (
          <>
            <SecLabel>Adjusted terms</SecLabel>
            <ReviewLine name="LeBron James — '03 Chrome RC" sub="PSA 10 · you give" val="–" valColor={colors.fgTertiary} />
            <ReviewLine name="Stephen Curry — '09 Chrome RC" sub="PSA 9 · you receive" val="+" valColor={colors.success} />
            <TotalRow label="Cash ask:" value="$900" valueColor={colors.primary} note="was $500" />
          </>
        )}
      </ScrollView>
      <View style={styles.reviewCta}>
        {composing ? (
          <Pressable style={[styles.acceptBtn, { backgroundColor: colors.primary }]} onPress={onSend}>
            <Text style={styles.acceptText}>Send counter →</Text>
          </Pressable>
        ) : (
          <>
            <Pressable style={[styles.acceptBtn, { backgroundColor: colors.success }]} onPress={onAccept}>
              <Text style={styles.acceptText}>Accept counter</Text>
            </Pressable>
            <View style={styles.reviewRow2}>
              <Pressable style={[styles.outlineBtn, { borderColor: colors.borderDefault }]} onPress={onSend}>
                <Text style={[styles.outlineText, { color: colors.fgSecondary }]}>Counter back</Text>
              </Pressable>
              <Pressable style={[styles.outlineBtn, { borderColor: colors.error }]} onPress={onDecline}>
                <Text style={[styles.outlineText, { color: colors.error }]}>Decline</Text>
              </Pressable>
            </View>
          </>
        )}
      </View>
    </SheetOverlay>
  );
}

// ── Double-check modal ──
export function DoubleCheckModal({ visible, onClose, mode, onConfirm }: { visible: boolean; onClose: () => void; mode: DealMode; onConfirm: () => void }) {
  const { colors } = useTheme();
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.dialogRoot}>
        <Pressable style={[styles.backdrop, { backgroundColor: colors.overlay }]} onPress={onClose} />
        <View style={[styles.modal, { backgroundColor: colors.bgBase }]}>
          <View style={[styles.modalHead, { borderBottomColor: colors.borderDefault }]}>
            <Text style={styles.modalGlyph}>🤝</Text>
            <Text style={[styles.modalTitle, { color: colors.fgPrimary }]}>Confirm {mode === "buy" ? "transfer" : "trade"}?</Text>
            <Text style={[styles.modalSub, { color: colors.fgTertiary }]}>
              {mode === "buy" ? "These cards move to Jake's portfolio automatically — no manual re-adding needed." : "Cards swap between portfolios automatically once you both confirm."}
            </Text>
          </View>
          {mode === "buy" ? (
            <>
              <TransferLine name="LeBron James — '03 Chrome RC" sub="PSA 10 · $10,500" dir="out" />
              <TransferLine name="Kobe Bryant — '96 Chrome RC" sub="PSA 8 · $1,000" dir="out" />
              <TotalRow label="You receive" value="$11,500" valueColor={colors.success} />
            </>
          ) : (
            <>
              <TransferLine name="LeBron James — '03 Chrome RC" sub="PSA 10" dir="out" />
              <TransferLine name="Stephen Curry — '09 Chrome RC" sub="PSA 9" dir="in" />
              <TransferLine name="Ja Morant — '19 Prizm RC" sub="PSA 10" dir="in" />
              <TotalRow label="+ Cash to you" value="$500" valueColor={colors.success} />
            </>
          )}
          <View style={styles.modalCta}>
            <Pressable style={[styles.acceptBtn, { backgroundColor: colors.success }]} onPress={onConfirm}>
              <Text style={styles.acceptText}>Confirm &amp; transfer</Text>
            </Pressable>
            <Pressable onPress={onClose} style={styles.modalCancel}>
              <Text style={[styles.modalCancelText, { color: colors.fgTertiary }]}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function SecLabel({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  return <Text style={[styles.secLabel, { color: colors.fgTertiary, borderTopColor: colors.borderDefault }]}>{children}</Text>;
}
function ReviewLine({ name, sub, val, valColor }: { name: string; sub: string; val: string; valColor?: string }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.reviewLine, { borderBottomColor: colors.borderDefault }]}>
      <GradientThumb accent={colors.primary} width={32} height={46} radius={6} />
      <View style={styles.flex}>
        <Text style={[styles.cardName, { color: colors.fgPrimary }]} numberOfLines={1}>{name}</Text>
        <Text style={[styles.cardSub, { color: colors.fgTertiary }]}>{sub}</Text>
      </View>
      <Text style={[styles.reviewVal, { color: valColor ?? colors.primary }]}>{val}</Text>
    </View>
  );
}
function TransferLine({ name, sub, dir }: { name: string; sub: string; dir: "out" | "in" }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.reviewLine, { borderBottomColor: colors.borderDefault }]}>
      <GradientThumb accent={dir === "out" ? colors.primary : colors.success} width={32} height={46} radius={6} />
      <View style={styles.flex}>
        <Text style={[styles.cardName, { color: colors.fgPrimary }]} numberOfLines={1}>{name}</Text>
        <Text style={[styles.cardSub, { color: colors.fgTertiary }]}>{sub}</Text>
      </View>
      <Text style={[styles.reviewVal, { color: dir === "out" ? colors.primary : colors.success }]}>{dir === "out" ? "→ Jake" : "→ You"}</Text>
    </View>
  );
}
function TotalRow({ label, value, valueColor, note }: { label: string; value: string; valueColor: string; note?: string }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.totalRow, { backgroundColor: colors.bgSurface }]}>
      <Text style={[styles.totalLabel, { color: colors.fgSecondary }]}>{label}</Text>
      <Text style={[styles.totalValue, { color: valueColor }]}>{value}</Text>
      {note ? <Text style={[styles.totalNote, { color: colors.fgTertiary }]}>{note}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  root: { flex: 1, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject },
  sheet: { borderTopLeftRadius: 22, borderTopRightRadius: 22, paddingBottom: 8, maxHeight: "88%" },
  handle: { alignSelf: "center", width: 38, height: 4.5, borderRadius: 3, marginTop: 10, marginBottom: 4 },

  headRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 18, paddingVertical: 10 },
  title: { fontFamily: fontFamily.socialExtrabold, fontSize: 16 },
  closeX: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, alignItems: "center", justifyContent: "center" },

  segment: { flexDirection: "row", gap: 6, marginHorizontal: 18, marginBottom: 4, padding: 4, borderRadius: 12, borderWidth: 1 },
  segItem: { flex: 1, paddingVertical: 9, borderRadius: 9, alignItems: "center" },
  segText: { fontFamily: fontFamily.socialBold, fontSize: 12 },

  body: { paddingHorizontal: 18, paddingTop: 8 },
  discRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10 },
  cardName: { fontFamily: fontFamily.socialBold, fontSize: 12 },
  cardSub: { fontFamily: fontFamily.body, fontSize: 10, marginTop: 1 },
  offerHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 6, marginBottom: 8 },
  offerLabel: { fontFamily: fontFamily.socialBold, fontSize: 11.5 },
  addCards: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 11, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  addCardsText: { fontFamily: fontFamily.socialBold, fontSize: 11 },
  amountBox: { flexDirection: "row", alignItems: "center", gap: 6, height: 50, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1.5 },
  amountSign: { fontFamily: fontFamily.socialExtrabold, fontSize: 18 },
  amount: { fontFamily: fontFamily.socialExtrabold, fontSize: 22 },
  belowAsk: { marginLeft: "auto", fontFamily: fontFamily.socialBold, fontSize: 10.5 },

  cardRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 9, borderBottomWidth: 1 },
  check: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  cashRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 11 },
  cashBox: { flexDirection: "row", alignItems: "center", gap: 3, height: 34, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1.5 },
  cashSign: { fontFamily: fontFamily.socialBold, fontSize: 12 },
  cash: { fontFamily: fontFamily.socialExtrabold, fontSize: 14 },
  side: { marginLeft: "auto", fontFamily: fontFamily.body, fontSize: 10 },

  cta: { padding: 18, paddingTop: 14 },
  ctaBtn: { paddingVertical: 13, borderRadius: 999, alignItems: "center" },
  ctaText: { fontFamily: fontFamily.socialBold, fontSize: 14, color: "#fff" },

  reviewHead: { paddingHorizontal: 18, paddingTop: 10, paddingBottom: 8 },
  reviewSub: { fontFamily: fontFamily.body, fontSize: 11, marginTop: 2 },
  reviewBody: { maxHeight: 320 },
  secLabel: { fontFamily: fontFamily.socialExtrabold, fontSize: 10.5, letterSpacing: 0.4, textTransform: "uppercase", paddingHorizontal: 18, paddingTop: 10, paddingBottom: 4, borderTopWidth: 1 },
  reviewLine: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 18, paddingVertical: 10, borderBottomWidth: 1 },
  reviewVal: { fontFamily: fontFamily.socialExtrabold, fontSize: 12 },
  totalRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 18, paddingVertical: 11 },
  totalLabel: { fontFamily: fontFamily.body, fontSize: 11 },
  totalValue: { fontFamily: fontFamily.socialExtrabold, fontSize: 16 },
  totalNote: { marginLeft: "auto", fontFamily: fontFamily.body, fontSize: 10 },
  reviewCta: { padding: 18, paddingTop: 12, gap: 9 },
  acceptBtn: { paddingVertical: 13, borderRadius: 999, alignItems: "center" },
  acceptText: { fontFamily: fontFamily.socialBold, fontSize: 14, color: "#fff" },
  reviewRow2: { flexDirection: "row", gap: 9 },
  outlineBtn: { flex: 1, paddingVertical: 10, borderRadius: 999, borderWidth: 1.5, alignItems: "center" },
  outlineText: { fontFamily: fontFamily.socialBold, fontSize: 12.5 },

  counterCompare: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 18, paddingVertical: 11, borderTopWidth: 1, borderBottomWidth: 1 },
  strike: { fontFamily: fontFamily.socialBold, fontSize: 14, textDecorationLine: "line-through" },
  counterLabel: { fontFamily: fontFamily.socialBold, fontSize: 11 },
  counterPrice: { fontFamily: fontFamily.socialExtrabold, fontSize: 18 },

  dialogRoot: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  dialog: { width: "100%", borderRadius: 18, overflow: "hidden" },
  dialogHead: { padding: 14, paddingHorizontal: 16, borderBottomWidth: 1 },
  dialogTitle: { fontFamily: fontFamily.socialExtrabold, fontSize: 14.5 },
  dialogSub: { fontFamily: fontFamily.body, fontSize: 10.5, marginTop: 2 },
  dialogCta: { flexDirection: "row", gap: 10, padding: 16 },
  dialogCancel: { flex: 1, paddingVertical: 11, borderRadius: 999, borderWidth: 1, alignItems: "center" },
  dialogCancelText: { fontFamily: fontFamily.socialBold, fontSize: 13 },
  dialogAdd: { flex: 1.4, paddingVertical: 11, borderRadius: 999, alignItems: "center" },
  dialogAddText: { fontFamily: fontFamily.socialBold, fontSize: 13, color: "#fff" },

  modal: { width: "100%", borderRadius: 22, overflow: "hidden" },
  modalHead: { padding: 22, paddingTop: 22, paddingBottom: 16, alignItems: "center", borderBottomWidth: 1 },
  modalGlyph: { fontSize: 34, marginBottom: 8 },
  modalTitle: { fontFamily: fontFamily.socialExtrabold, fontSize: 17 },
  modalSub: { fontFamily: fontFamily.body, fontSize: 11.5, textAlign: "center", lineHeight: 17, marginTop: 5 },
  modalCta: { padding: 18 },
  modalCancel: { paddingVertical: 10, alignItems: "center", marginTop: 4 },
  modalCancelText: { fontFamily: fontFamily.socialBold, fontSize: 13 },
});
