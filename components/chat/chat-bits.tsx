import { GradientThumb } from "@/components/home/gradient-thumb";
import { Avatar } from "@/components/ui/avatar";
import { fontFamily } from "@/constants/theme";
import { Msg, Thread } from "@/lib/chat-mock";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export function ChatHeader({ thread, onBack, onMore }: { thread: Thread; onBack: () => void; onMore?: () => void }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.header, { borderBottomColor: colors.borderDefault }]}>
      <Pressable onPress={onBack} hitSlop={8}>
        <Ionicons name="chevron-back" size={24} color={colors.fgPrimary} />
      </Pressable>
      {thread.kind === "group" ? (
        <View style={[styles.mosaic, { backgroundColor: colors.bgSurface }]}>
          {["#E76F51", "#7C3AED", "#10B981", "#f59e0b"].map((c, i) => (
            <View key={i} style={[styles.mosaicCell, { backgroundColor: c, top: i < 2 ? 1 : 21, left: i % 2 === 0 ? 1 : 21, borderColor: colors.bgBase }]}>
              <Text style={styles.mosaicText}>{"JMAD"[i]}</Text>
            </View>
          ))}
        </View>
      ) : (
        <View>
          <Avatar name={thread.name} size={38} color={thread.color} />
          {thread.online ? <View style={[styles.onlineDot, { backgroundColor: colors.success, borderColor: colors.bgBase }]} /> : null}
        </View>
      )}
      <View style={styles.flex}>
        <View style={styles.nameRow}>
          <Text style={[styles.name, { color: colors.fgPrimary }]} numberOfLines={1}>{thread.name}</Text>
          {thread.vendor ? <Ionicons name="checkmark-circle" size={10} color={colors.success} /> : null}
        </View>
        <Text style={[styles.sub, { color: thread.online ? colors.success : colors.fgTertiary }]}>
          {thread.kind === "group" ? "Jake, Marcus, Ava +5" : thread.online ? "● Active now" : "Active 2h ago"}
        </Text>
      </View>
      <Pressable onPress={onMore} hitSlop={8}>
        <Ionicons name="ellipsis-horizontal" size={18} color={colors.fgPrimary} />
      </Pressable>
    </View>
  );
}

export function Bubble({ me, children, time }: { me?: boolean; children: React.ReactNode; time: string }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.bubbleWrap, { alignItems: me ? "flex-end" : "flex-start" }]}>
      <View
        style={[
          styles.bubble,
          me
            ? { backgroundColor: colors.primary, borderBottomRightRadius: 4 }
            : { backgroundColor: colors.bgBase, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: colors.borderDefault },
        ]}
      >
        <Text style={[styles.bubbleText, { color: me ? "#fff" : colors.fgPrimary }]}>{children}</Text>
      </View>
      <Text style={[styles.bubbleTime, { color: colors.fgTertiary }]}>{time}</Text>
    </View>
  );
}

export function GroupBubble({ msg }: { msg: Msg }) {
  const { colors } = useTheme();
  if (msg.me) return <Bubble me time={msg.time}>{msg.text}</Bubble>;
  return (
    <View style={styles.groupWrap}>
      <Text style={[styles.groupSender, { color: msg.senderColor }]}>{msg.sender}</Text>
      <View style={styles.groupRow}>
        <Avatar name={msg.sender} size={30} color={msg.senderColor ?? colors.primary} />
        <View>
          <View style={[styles.bubble, { backgroundColor: colors.bgBase, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: colors.borderDefault, maxWidth: 218 }]}>
            <Text style={[styles.bubbleText, { color: colors.fgPrimary }]}>{msg.text}</Text>
          </View>
          <Text style={[styles.bubbleTime, { color: colors.fgTertiary }]}>{msg.time}</Text>
        </View>
      </View>
    </View>
  );
}

export type PinCta = { label: string; color: string; onPress: () => void; circleIcon?: keyof typeof Ionicons.glyphMap };

export function PinnedCard({ tag, tagColor, cta, dim }: { tag: string; tagColor: string; cta: PinCta | null; dim?: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.pinned, { backgroundColor: colors.bgSurface, borderColor: cta && !dim ? cta.color : colors.borderDefault }]}>
      <GradientThumb accent={colors.primary} width={40} height={56} radius={7} />
      <View style={styles.flex}>
        <Text style={[styles.pinTag, { color: tagColor }]}>{tag}</Text>
        <Text style={[styles.pinTitle, { color: colors.fgPrimary }]} numberOfLines={1}>LeBron James — &apos;03 Chrome RC</Text>
        <Text style={[styles.pinPrice, { color: colors.primary }]}>$12,500 · PSA 10</Text>
      </View>
      {cta ? (
        cta.circleIcon ? (
          <Pressable onPress={cta.onPress} style={[styles.pinCircle, { backgroundColor: cta.color }]}>
            <Ionicons name={cta.circleIcon} size={20} color="#fff" />
          </Pressable>
        ) : (
          <Pressable onPress={cta.onPress} style={[styles.pinBtn, { backgroundColor: cta.color }]}>
            <Text style={styles.pinBtnText}>{cta.label}</Text>
          </Pressable>
        )
      ) : (
        <Ionicons name="chevron-forward" size={18} color={colors.fgTertiary} />
      )}
    </View>
  );
}

export function SystemNote({ tone = "neutral", title, children }: { tone?: "neutral" | "amber" | "green" | "red"; title?: string; children?: React.ReactNode }) {
  const { colors } = useTheme();
  const toneColor = tone === "amber" ? colors.warning : tone === "green" ? colors.success : tone === "red" ? colors.error : colors.fgSecondary;
  const bg = tone === "green" ? colors.successMuted : tone === "red" ? "rgba(239,68,68,0.06)" : colors.bgSurface;
  const border = tone === "green" ? colors.success : tone === "red" ? colors.error : colors.borderDefault;
  return (
    <View style={[styles.note, { backgroundColor: bg, borderColor: border }]}>
      {title ? <Text style={[styles.noteTitle, { color: toneColor }]}>{title}</Text> : null}
      {children ? <Text style={[styles.noteText, { color: colors.fgSecondary }]}>{children}</Text> : null}
    </View>
  );
}

export function ChatInput({ value, onChangeText, onSend }: { value: string; onChangeText: (t: string) => void; onSend: () => void }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.inputBar, { borderTopColor: colors.borderDefault }]}>
      <View style={[styles.plus, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
        <Ionicons name="add" size={19} color={colors.primary} />
      </View>
      <View style={[styles.input, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
        <TextInput
          style={[styles.inputText, { color: colors.fgPrimary }]}
          value={value}
          onChangeText={onChangeText}
          placeholder="Message…"
          placeholderTextColor={colors.fgTertiary}
          onSubmitEditing={onSend}
          returnKeyType="send"
        />
      </View>
      <Pressable style={[styles.send, { backgroundColor: colors.primary }]} onPress={onSend}>
        <Ionicons name="arrow-forward" size={16} color="#fff" />
      </Pressable>
    </View>
  );
}

export function DayDivider({ label }: { label: string }) {
  const { colors } = useTheme();
  return <Text style={[styles.day, { color: colors.fgTertiary }]}>{label}</Text>;
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  header: { flexDirection: "row", alignItems: "center", gap: 11, paddingHorizontal: 14, paddingBottom: 11, paddingTop: 2, borderBottomWidth: 1 },
  onlineDot: { position: "absolute", bottom: 0, right: 0, width: 11, height: 11, borderRadius: 6, borderWidth: 2 },
  mosaic: { width: 40, height: 40, borderRadius: 13, overflow: "hidden" },
  mosaicCell: { position: "absolute", width: 18, height: 18, borderRadius: 4, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  mosaicText: { fontFamily: fontFamily.socialExtrabold, fontSize: 8, color: "#fff" },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  name: { fontFamily: fontFamily.socialExtrabold, fontSize: 14 },
  sub: { fontFamily: fontFamily.body, fontSize: 10.5, marginTop: 1 },

  bubbleWrap: { marginBottom: 10 },
  bubble: { maxWidth: "76%", paddingHorizontal: 13, paddingVertical: 9, borderRadius: 16 },
  bubbleText: { fontFamily: fontFamily.body, fontSize: 13.5, lineHeight: 19 },
  bubbleTime: { fontFamily: fontFamily.body, fontSize: 9.5, marginTop: 4, marginHorizontal: 4 },
  groupWrap: { alignItems: "flex-start", marginBottom: 10 },
  groupSender: { fontFamily: fontFamily.socialBold, fontSize: 10, marginLeft: 42, marginBottom: 3 },
  groupRow: { flexDirection: "row", alignItems: "flex-end", gap: 7 },

  pinned: { flexDirection: "row", alignItems: "center", gap: 11, marginHorizontal: 14, marginTop: 10, marginBottom: 4, padding: 9, paddingHorizontal: 11, borderRadius: 14, borderWidth: 1 },
  pinTag: { fontFamily: fontFamily.socialExtrabold, fontSize: 8.5, letterSpacing: 0.5 },
  pinTitle: { fontFamily: fontFamily.socialBold, fontSize: 12, marginTop: 1 },
  pinPrice: { fontFamily: fontFamily.socialExtrabold, fontSize: 11.5, marginTop: 1 },
  pinCircle: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  pinBtn: { paddingHorizontal: 13, paddingVertical: 7, borderRadius: 999 },
  pinBtnText: { fontFamily: fontFamily.socialBold, fontSize: 11, color: "#fff" },

  note: { marginHorizontal: 4, marginVertical: 10, padding: 12, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, alignItems: "center" },
  noteTitle: { fontFamily: fontFamily.socialExtrabold, fontSize: 12 },
  noteText: { fontFamily: fontFamily.body, fontSize: 11, lineHeight: 16, textAlign: "center", marginTop: 3 },

  inputBar: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1 },
  plus: { width: 38, height: 38, borderRadius: 19, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  input: { flex: 1, height: 40, paddingHorizontal: 16, borderRadius: 999, borderWidth: 1, justifyContent: "center" },
  inputText: { fontFamily: fontFamily.body, fontSize: 13, padding: 0 },
  send: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },

  day: { fontFamily: fontFamily.socialBold, fontSize: 10, textAlign: "center", marginBottom: 12, letterSpacing: 0.5 },
});
