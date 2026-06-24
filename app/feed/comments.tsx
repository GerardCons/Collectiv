import { FeedNav } from "@/components/home/feed-nav";
import { Avatar } from "@/components/ui/avatar";
import { fontFamily, space } from "@/constants/theme";
import { CommentItem, COMMENTS, COMMENTS_RECAP, FEED_COLORS } from "@/lib/home-mock";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CommentsScreen() {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgBase }]} edges={["top"]}>
      <FeedNav title="Comments" subtitle="23 comments" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={8}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          {/* original post recap */}
          <View style={[styles.recap, { borderBottomColor: colors.bgSurface }]}>
            <View style={styles.recapHead}>
              <Avatar name={COMMENTS_RECAP.name} size={40} color={COMMENTS_RECAP.color} />
              <View style={styles.flex}>
                <Text style={[styles.recapName, { color: colors.fgPrimary }]}>{COMMENTS_RECAP.name}</Text>
                <Text style={[styles.handle, { color: colors.fgTertiary }]}>@{COMMENTS_RECAP.handle} · {COMMENTS_RECAP.time}</Text>
              </View>
            </View>
            <Text style={[styles.recapText, { color: colors.fgPrimary }]}>{COMMENTS_RECAP.text}</Text>
          </View>

          {COMMENTS.map((c, i) => (
            <CommentRow key={i} comment={c} />
          ))}
        </ScrollView>

        {/* input */}
        <View style={[styles.inputBar, { borderTopColor: colors.borderDefault }]}>
          <Avatar name="Jake" size={30} color={FEED_COLORS.coral} />
          <View style={[styles.input, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
            <TextInput
              placeholder="Add a comment…"
              placeholderTextColor={colors.fgTertiary}
              style={[styles.inputText, { color: colors.fgPrimary }]}
            />
          </View>
          <View style={[styles.send, { backgroundColor: colors.primary }]}>
            <Ionicons name="send" size={15} color="#fff" />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function CommentRow({ comment }: { comment: CommentItem }) {
  const { colors } = useTheme();
  const size = comment.indent ? 28 : 34;
  return (
    <View style={[styles.comment, { borderBottomColor: colors.borderDefault, paddingLeft: comment.indent ? 52 : space.lg }]}>
      <Avatar name={comment.name} size={size} color={comment.color} />
      <View style={styles.flex}>
        <View style={styles.commentHead}>
          <Text style={[styles.commentName, { color: colors.fgPrimary }]}>{comment.name}</Text>
          <Text style={[styles.commentTime, { color: colors.fgTertiary }]}>{comment.time}</Text>
        </View>
        <Text style={[styles.commentText, { color: colors.fgPrimary }]}>{comment.text}</Text>
        <View style={styles.commentMeta}>
          <Text style={[styles.reply, { color: colors.fgTertiary }]}>Reply</Text>
          {comment.replies ? (
            <Text style={[styles.reply, { color: colors.primary }]}>View {comment.replies} replies</Text>
          ) : null}
        </View>
      </View>
      <View style={styles.likeCol}>
        <Ionicons
          name={comment.likes ? "heart" : "heart-outline"}
          size={13}
          color={comment.likes ? colors.primary : colors.fgTertiary}
        />
        {comment.likes ? <Text style={[styles.likeCount, { color: colors.fgTertiary }]}>{comment.likes}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1, minWidth: 0 },

  recap: { paddingHorizontal: space.lg, paddingVertical: space.md, borderBottomWidth: 6 },
  recapHead: { flexDirection: "row", alignItems: "center", gap: 10 },
  recapName: { fontFamily: fontFamily.socialBold, fontSize: 13 },
  handle: { fontFamily: fontFamily.body, fontSize: 10.5, marginTop: 1 },
  recapText: { fontFamily: fontFamily.body, fontSize: 13, lineHeight: 19.5, marginTop: 9 },

  comment: { flexDirection: "row", gap: 10, paddingHorizontal: space.lg, paddingVertical: 11, borderBottomWidth: 1 },
  commentHead: { flexDirection: "row", alignItems: "center", gap: 6 },
  commentName: { fontFamily: fontFamily.socialBold, fontSize: 12.5 },
  commentTime: { fontFamily: fontFamily.body, fontSize: 10 },
  commentText: { fontFamily: fontFamily.body, fontSize: 12.5, lineHeight: 18.5, marginTop: 3 },
  commentMeta: { flexDirection: "row", gap: 16, marginTop: 6 },
  reply: { fontFamily: fontFamily.bodySemibold, fontSize: 10.5 },
  likeCol: { alignItems: "center", gap: 2 },
  likeCount: { fontFamily: fontFamily.body, fontSize: 9.5 },

  inputBar: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1 },
  input: { flex: 1, height: 38, paddingHorizontal: 15, borderRadius: 999, borderWidth: 1, justifyContent: "center" },
  inputText: { fontFamily: fontFamily.body, fontSize: 13, padding: 0 },
  send: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
});
