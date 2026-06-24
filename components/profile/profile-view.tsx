import { GradientThumb } from "@/components/home/gradient-thumb";
import { ActionSheet } from "@/components/ui/action-sheet";
import { Avatar } from "@/components/ui/avatar";
import { fontFamily } from "@/constants/theme";
import {
  ACTIVITY,
  GALLERY,
  JOINED_GROUPS,
  LISTINGS,
  PEOPLE,
  ProfilePerson,
  ProfileVariant,
  RATING_BARS,
  REVIEW_FILTERS,
  REVIEWS,
  SHOWCASE,
  SUGGEST_ACCOUNTS,
  SUGGEST_VENDORS,
  TABS,
} from "@/lib/profile-mock";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { Linking, Pressable, ScrollView, Share, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function ProfileView({ variant }: { variant: ProfileVariant }) {
  const { colors } = useTheme();
  const p = PEOPLE[variant];
  const tabs = TABS[variant];
  const [tab, setTab] = useState(tabs[0]);
  const [dropOpen, setDropOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [following, setFollowing] = useState(false);

  function back() {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/portfolio");
  }
  async function share() {
    try {
      await Share.share({ message: `Check out @${p.handle} on Collectiv` });
    } catch {
      /* dismissed */
    }
  }
  function directions() {
    const q = encodeURIComponent(p.address ?? p.loc);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${q}`).catch(() => {});
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgBase }]} edges={["top"]}>
      {/* Nav */}
      <View style={styles.nav}>
        <Pressable onPress={back} hitSlop={8} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.fgPrimary} />
        </Pressable>
        <Text style={[styles.navTitle, { color: colors.fgPrimary }]} numberOfLines={1}>
          {variant === "own" ? "Profile" : `@${p.handle}`}
        </Text>
        {variant === "own" ? (
          <Pressable onPress={() => router.push("/settings")} hitSlop={8} style={[styles.navBtn, styles.navRight]}>
            <Ionicons name="settings-outline" size={18} color={colors.fgPrimary} />
          </Pressable>
        ) : (
          <Pressable onPress={() => setMoreOpen(true)} hitSlop={8} style={[styles.navBtn, styles.navRight]}>
            <Ionicons name="ellipsis-horizontal" size={18} color={colors.fgPrimary} />
          </Pressable>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[1]}>
        {/* Header */}
        <View style={styles.header}>
          <ProfileAvatar p={p} />
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: colors.fgPrimary }]}>{p.name}</Text>
            {p.verified ? <Ionicons name="checkmark-circle" size={14} color={colors.success} /> : null}
          </View>
          <View style={styles.handleRow}>
            <Text style={[styles.handle, { color: colors.fgTertiary }]}>@{p.handle}</Text>
            {p.powerVendor ? (
              <View style={[styles.powerBadge, { backgroundColor: colors.secondaryMuted }]}>
                <Text style={[styles.powerText, { color: colors.secondary }]}>POWER VENDOR</Text>
              </View>
            ) : null}
          </View>
          <Text style={[styles.bio, { color: colors.fgSecondary }]}>{p.bio}</Text>
          <View style={styles.locRow}>
            <Text style={styles.locGlyph}>📍</Text>
            <Text style={[styles.loc, { color: colors.fgTertiary }]}>{p.loc}</Text>
            {p.vendor ? (
              <>
                <Text style={[styles.openTag, { color: p.open ? colors.success : colors.warning }]}>{p.open ? "Open" : "Closed"}</Text>
                <Text style={[styles.loc, { color: colors.fgTertiary }]}>· {p.hours}</Text>
              </>
            ) : null}
          </View>

          {/* Stats */}
          <View style={styles.stats}>
            {p.stats.map(([v, l], i) => (
              <View key={l} style={[styles.stat, i > 0 && { borderLeftWidth: 1, borderLeftColor: colors.borderDefault }]}>
                <Text style={[styles.statVal, { color: i === 0 ? colors.primary : colors.fgPrimary }]}>{v}</Text>
                <Text style={[styles.statLabel, { color: colors.fgTertiary }]}>{l}</Text>
              </View>
            ))}
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            {variant === "own" ? (
              <>
                <ActionPill label="Edit Profile" onPress={() => router.push("/profile/edit")} />
                <ActionPill label="Share Profile" onPress={share} />
              </>
            ) : variant === "vendor" ? (
              <>
                <ActionPill label="📍 Directions" primary onPress={directions} />
                <ActionPill label="Message" onPress={() => router.push("/chat")} />
              </>
            ) : (
              <>
                <ActionPill label={following ? "✓ Following" : "+ Follow"} primary={!following} onPress={() => setFollowing((v) => !v)} />
                <ActionPill label="Message" onPress={() => router.push("/chat")} />
              </>
            )}
            <Pressable style={[styles.dropBtn, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]} onPress={() => setDropOpen((v) => !v)}>
              <Ionicons name={dropOpen ? "chevron-up" : "chevron-down"} size={12} color={colors.fgPrimary} />
            </Pressable>
          </View>

          {/* Joined groups (own/user) */}
          {variant !== "vendor" ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.joined}>
              {JOINED_GROUPS.map((g) => (
                <View key={g.name} style={styles.joinedItem}>
                  <LinearGradient colors={[g.color, colors.primary]} start={{ x: 0.2, y: 0 }} end={{ x: 1, y: 1 }} style={styles.joinedRing}>
                    <View style={[styles.joinedInner, { backgroundColor: colors.bgBase }]}>
                      <View style={[styles.joinedIcon, { backgroundColor: g.color }]}>
                        <Text style={{ fontSize: 19 }}>{g.icon}</Text>
                      </View>
                    </View>
                  </LinearGradient>
                  <Text style={[styles.joinedName, { color: colors.fgSecondary }]} numberOfLines={1}>{g.name}</Text>
                </View>
              ))}
            </ScrollView>
          ) : null}

          {/* Suggested dropdown */}
          {dropOpen ? <Suggested variant={variant} /> : null}
        </View>

        {/* Tab strip (sticky) */}
        <View style={[styles.tabStrip, { backgroundColor: colors.bgBase, borderBottomColor: colors.borderDefault }]}>
          {tabs.map((t) => {
            const on = t === tab;
            return (
              <Pressable key={t} style={styles.tab} onPress={() => setTab(t)}>
                <Text style={[styles.tabText, { color: on ? colors.fgPrimary : colors.fgTertiary, fontFamily: on ? fontFamily.socialExtrabold : fontFamily.socialMedium }]}>{t}</Text>
                {on ? <View style={[styles.tabUnderline, { backgroundColor: colors.fgPrimary }]} /> : null}
              </Pressable>
            );
          })}
        </View>

        {/* Body */}
        <Body variant={variant} tab={tab} person={p} />
      </ScrollView>

      {/* ··· more sheet */}
      <ActionSheet
        visible={moreOpen}
        onClose={() => setMoreOpen(false)}
        header={{ title: p.name, subtitle: `@${p.handle}`, avatar: <Avatar name={p.name} size={46} color={p.color} /> }}
        actions={[
          { icon: "person-add-outline", label: following ? "Unfollow" : "Follow", onPress: () => setFollowing((v) => !v) },
          { icon: "chatbubble-ellipses-outline", label: "Message", onPress: () => router.push("/chat") },
          { icon: "notifications-outline", label: "Turn on notifications", onPress: () => {} },
          { icon: "share-social-outline", label: "Share profile", onPress: share },
          { icon: "ban-outline", label: "Block", danger: true, onPress: () => {} },
          { icon: "flag-outline", label: "Report", danger: true, onPress: () => {} },
        ]}
      />
    </SafeAreaView>
  );
}

function ProfileAvatar({ p }: { p: ProfilePerson }) {
  const { colors } = useTheme();
  if (p.vendor) {
    return (
      <View style={styles.vendorAvatar}>
        <LinearGradient colors={[colors.secondary, `${colors.secondary}bb`]} start={{ x: 0.2, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
        <Text style={{ fontSize: 35 }}>{p.emoji}</Text>
      </View>
    );
  }
  return <Avatar name={p.name} size={84} color={p.color} />;
}

function ActionPill({ label, primary, onPress }: { label: string; primary?: boolean; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[styles.pill, primary ? { backgroundColor: colors.primary } : { backgroundColor: colors.bgSurface, borderWidth: 1, borderColor: colors.borderDefault }]}
    >
      <Text style={[styles.pillText, { color: primary ? "#fff" : colors.fgPrimary }]}>{label}</Text>
    </Pressable>
  );
}

function Suggested({ variant }: { variant: ProfileVariant }) {
  const { colors } = useTheme();
  const isVendor = variant === "vendor";
  return (
    <View style={styles.suggested}>
      <View style={styles.suggestedHead}>
        <Text style={[styles.suggestedLabel, { color: colors.fgPrimary }]}>{isVendor ? "Suggested vendors" : "Suggested accounts"}</Text>
        <Text style={[styles.viewAll, { color: colors.primary }]}>View all ›</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestRow}>
        {(isVendor ? SUGGEST_VENDORS : SUGGEST_ACCOUNTS).map((s, i) => (
          <View key={i} style={[styles.suggestCard, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}>
            {isVendor ? (
              <View style={[styles.suggestVendorIcon, { backgroundColor: s.color }]}>
                <Text style={{ fontSize: 20 }}>🏪</Text>
              </View>
            ) : (
              <Avatar name={s.name} size={48} color={s.color} />
            )}
            <Text style={[styles.suggestName, { color: colors.fgPrimary }]} numberOfLines={1}>{s.name}</Text>
            <Text style={[styles.suggestSub, { color: colors.fgTertiary }]}>{s.sub}</Text>
            <View style={[styles.suggestBtn, { backgroundColor: colors.primary }]}>
              <Text style={styles.suggestBtnText}>{isVendor ? "Visit" : "Follow"}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function Body({ variant, tab, person }: { variant: ProfileVariant; tab: string; person: ProfilePerson }) {
  if (tab === "Listings") return <ListingsGrid />;
  if (tab === "Gallery") return <GalleryGrid />;
  if (tab === "Activity") return <ActivityFeed person={person} />;
  if (tab === "Reviews") return <ReviewsTab />;
  return <ShowcaseGrid />;
}

function ShowcaseGrid() {
  return (
    <View style={styles.showcaseGrid}>
      {SHOWCASE.map((c, i) => (
        <View key={i} style={styles.showcaseCell}>
          <LinearGradient colors={["#1a1210", c.color]} start={{ x: 0.2, y: 0 }} end={{ x: 1, y: 1.6 }} style={StyleSheet.absoluteFill} />
          <View style={styles.showcaseCenter}>
            <GradientThumb accent="rgba(255,255,255,0.16)" width={76} height={108} radius={7} />
          </View>
          <View style={styles.showcaseBadge}>
            <Text style={styles.showcaseBadgeText}>⭐ SHOWCASE</Text>
          </View>
          <View style={styles.showcaseCaption}>
            <Text style={styles.showcaseName} numberOfLines={2}>{c.name}</Text>
            <Text style={styles.showcaseSub}>{c.sub}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function ListingsGrid() {
  const { colors } = useTheme();
  return (
    <View style={styles.grid3}>
      {LISTINGS.map((c, i) => (
        <View key={i} style={[styles.listCell, { backgroundColor: colors.bgBase }]}>
          <View style={styles.listArt}>
            <GradientThumb accent={c.color} width="100%" height={96} radius={0} />
            <View style={[styles.gradeBadge, { backgroundColor: colors.successMuted }]}>
              <Text style={[styles.gradeText, { color: colors.success }]}>{c.grade}</Text>
            </View>
          </View>
          <View style={styles.listMeta}>
            <Text style={[styles.listPrice, { color: colors.primary }]}>{c.price}</Text>
            <Text style={[styles.listName, { color: colors.fgPrimary }]} numberOfLines={1}>{c.name}</Text>
            <Text style={[styles.listSub, { color: colors.fgTertiary }]}>{c.sub}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function GalleryGrid() {
  return (
    <View style={styles.galleryGrid}>
      {GALLERY.map((c, i) => (
        <View key={i} style={styles.galleryCell}>
          <GradientThumb accent={c} width="100%" height={123} radius={0} />
          {i === 0 ? (
            <View style={styles.galleryCount}>
              <Text style={styles.galleryCountText}>📷 14</Text>
            </View>
          ) : null}
        </View>
      ))}
    </View>
  );
}

function ActivityFeed({ person }: { person: ProfilePerson }) {
  const { colors } = useTheme();
  return (
    <View>
      {ACTIVITY.map((post, i) => (
        <View key={i} style={[styles.post, { borderBottomColor: colors.borderDefault }]}>
          <View style={styles.postHead}>
            <Avatar name={person.name} size={34} color={person.color} />
            <View style={styles.flex}>
              <View style={styles.postNameRow}>
                <Text style={[styles.postName, { color: colors.fgPrimary }]}>{person.name}</Text>
                <View style={[styles.postBadge, { backgroundColor: `${post.badgeColor}1a` }]}>
                  <Text style={[styles.postBadgeText, { color: post.badgeColor }]}>{post.badge}</Text>
                </View>
              </View>
              <Text style={[styles.postHandle, { color: colors.fgTertiary }]}>@{person.handle} · {post.time}</Text>
            </View>
          </View>
          <Text style={[styles.postText, { color: colors.fgPrimary }]}>{post.text}</Text>
          <View style={styles.postCard}>
            <LinearGradient colors={["#1a1210", post.color]} start={{ x: 0.2, y: 0 }} end={{ x: 1, y: 1.6 }} style={StyleSheet.absoluteFill} />
            <GradientThumb accent="rgba(255,255,255,0.16)" width={72} height={100} radius={7} />
          </View>
          <View style={styles.postActions}>
            <Text style={[styles.postAction, { color: colors.fgTertiary }]}>♡ {post.likes}</Text>
            <Text style={[styles.postAction, { color: colors.fgTertiary }]}>💬 {post.comments}</Text>
            <Text style={[styles.postAction, { color: colors.fgTertiary }]}>↗ Share</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function ReviewsTab() {
  const { colors } = useTheme();
  const [filter, setFilter] = useState("Relevance");
  return (
    <View>
      <View style={[styles.ratingSummary, { borderBottomColor: colors.borderDefault }]}>
        <View style={styles.ratingBig}>
          <Text style={[styles.ratingNum, { color: colors.fgPrimary }]}>4.9</Text>
          <Text style={[styles.ratingStars, { color: colors.warning }]}>★★★★★</Text>
          <Text style={[styles.ratingCount, { color: colors.fgTertiary }]}>143 reviews</Text>
        </View>
        <View style={styles.flex}>
          {RATING_BARS.map(([n, pct]) => (
            <View key={n} style={styles.barRow}>
              <Text style={[styles.barN, { color: colors.fgTertiary }]}>{n}</Text>
              <View style={[styles.barTrack, { backgroundColor: colors.bgSurface }]}>
                <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: colors.warning }]} />
              </View>
              <Text style={[styles.barPct, { color: colors.fgTertiary }]}>{pct}%</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={[styles.reviewFilters, { borderBottomColor: colors.borderDefault }]}>
        {REVIEW_FILTERS.map((f) => {
          const on = f === filter;
          return (
            <Pressable key={f} onPress={() => setFilter(f)} style={[styles.reviewChip, on ? { backgroundColor: colors.fgPrimary } : { backgroundColor: colors.bgSurface, borderWidth: 1, borderColor: colors.borderDefault }]}>
              <Text style={[styles.reviewChipText, { color: on ? colors.bgBase : colors.fgSecondary }]}>{f}</Text>
            </Pressable>
          );
        })}
      </View>
      {REVIEWS.map((r, i) => (
        <View key={i} style={[styles.review, { borderBottomColor: colors.borderDefault }]}>
          <View style={styles.reviewHead}>
            <Avatar name={r.handle} size={36} color={r.color} />
            <View style={styles.flex}>
              <Text style={[styles.reviewHandle, { color: colors.fgPrimary }]}>@{r.handle}</Text>
              <View style={styles.reviewStarsRow}>
                <Text style={{ fontSize: 10 }}>
                  <Text style={{ color: colors.warning }}>{"★".repeat(r.stars)}</Text>
                  <Text style={{ color: colors.borderStrong }}>{"★".repeat(5 - r.stars)}</Text>
                </Text>
                <Text style={[styles.reviewTime, { color: colors.fgTertiary }]}>{r.time} ago</Text>
              </View>
            </View>
          </View>
          <Text style={[styles.reviewText, { color: colors.fgSecondary }]}>{r.text}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1, minWidth: 0 },

  nav: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingBottom: 6, paddingTop: 2 },
  navBtn: { width: 34, height: 34, justifyContent: "center" },
  navRight: { alignItems: "flex-end" },
  navTitle: { flex: 1, textAlign: "center", fontFamily: fontFamily.socialBold, fontSize: 13.5 },

  header: { alignItems: "center", paddingHorizontal: 24, paddingTop: 6, paddingBottom: 14 },
  vendorAvatar: { width: 84, height: 84, borderRadius: 24, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 12 },
  name: { fontFamily: fontFamily.socialExtrabold, fontSize: 21, letterSpacing: -0.3 },
  handleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 2 },
  handle: { fontFamily: fontFamily.body, fontSize: 12.5 },
  powerBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  powerText: { fontFamily: fontFamily.socialExtrabold, fontSize: 9 },
  bio: { fontFamily: fontFamily.body, fontSize: 12.5, lineHeight: 19, marginTop: 10, textAlign: "center", maxWidth: 300 },
  locRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 8, flexWrap: "wrap", justifyContent: "center" },
  locGlyph: { fontSize: 11 },
  loc: { fontFamily: fontFamily.body, fontSize: 11.5 },
  openTag: { fontFamily: fontFamily.socialBold, fontSize: 11.5, marginLeft: 4 },

  stats: { flexDirection: "row", alignItems: "center", marginTop: 16, alignSelf: "stretch" },
  stat: { flex: 1, alignItems: "center" },
  statVal: { fontFamily: fontFamily.socialExtrabold, fontSize: 18 },
  statLabel: { fontFamily: fontFamily.bodySemibold, fontSize: 9.5, marginTop: 2, letterSpacing: 0.3 },

  actions: { flexDirection: "row", gap: 9, marginTop: 18, alignSelf: "stretch" },
  pill: { flex: 1, paddingVertical: 11, borderRadius: 999, alignItems: "center" },
  pillText: { fontFamily: fontFamily.socialBold, fontSize: 13.5 },
  dropBtn: { width: 46, borderRadius: 999, borderWidth: 1, alignItems: "center", justifyContent: "center" },

  joined: { gap: 14, marginTop: 14, paddingRight: 8 },
  joinedItem: { alignItems: "center", gap: 5, width: 60 },
  joinedRing: { width: 56, height: 56, borderRadius: 28, padding: 2.5 },
  joinedInner: { flex: 1, borderRadius: 28, alignItems: "center", justifyContent: "center" },
  joinedIcon: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  joinedName: { fontFamily: fontFamily.bodySemibold, fontSize: 8.5, maxWidth: 56, textAlign: "center" },

  suggested: { alignSelf: "stretch", marginTop: 14 },
  suggestedHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  suggestedLabel: { fontFamily: fontFamily.socialExtrabold, fontSize: 12.5 },
  viewAll: { fontFamily: fontFamily.socialBold, fontSize: 11.5 },
  suggestRow: { gap: 9 },
  suggestCard: { width: 128, borderRadius: 14, borderWidth: 1, padding: 12, paddingHorizontal: 10, alignItems: "center" },
  suggestVendorIcon: { width: 48, height: 48, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  suggestName: { fontFamily: fontFamily.socialBold, fontSize: 11.5, marginTop: 8 },
  suggestSub: { fontFamily: fontFamily.body, fontSize: 9.5, marginTop: 1 },
  suggestBtn: { alignSelf: "stretch", marginTop: 9, paddingVertical: 6, borderRadius: 999, alignItems: "center" },
  suggestBtnText: { fontFamily: fontFamily.socialBold, fontSize: 11, color: "#fff" },

  tabStrip: { flexDirection: "row", borderBottomWidth: 1 },
  tab: { flex: 1, alignItems: "center", paddingTop: 11, paddingBottom: 10 },
  tabText: { fontSize: 12 },
  tabUnderline: { position: "absolute", bottom: -1, left: 0, right: 0, height: 2.5, borderRadius: 2 },

  showcaseGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, padding: 12 },
  showcaseCell: { width: "47.5%", flexGrow: 1, height: 180, borderRadius: 14, overflow: "hidden", justifyContent: "flex-end" },
  showcaseCenter: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center" },
  showcaseBadge: { position: "absolute", top: 9, left: 9, backgroundColor: "rgba(124,58,237,0.85)", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  showcaseBadgeText: { fontFamily: fontFamily.socialExtrabold, fontSize: 8, color: "#fff" },
  showcaseCaption: { padding: 10 },
  showcaseName: { fontFamily: fontFamily.socialExtrabold, fontSize: 11, color: "#fff", lineHeight: 13 },
  showcaseSub: { fontFamily: fontFamily.body, fontSize: 9, color: "rgba(255,255,255,0.7)", marginTop: 2 },

  grid3: { flexDirection: "row", flexWrap: "wrap", gap: 6, padding: 12 },
  listCell: { width: "31.5%", borderRadius: 10, overflow: "hidden", ...shadowSm() },
  listArt: { height: 96 },
  gradeBadge: { position: "absolute", top: 5, right: 5, paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 },
  gradeText: { fontFamily: fontFamily.bodyExtrabold, fontSize: 7 },
  listMeta: { padding: 7, paddingTop: 6 },
  listPrice: { fontFamily: fontFamily.socialExtrabold, fontSize: 11 },
  listName: { fontFamily: fontFamily.bodySemibold, fontSize: 9, marginTop: 1 },
  listSub: { fontFamily: fontFamily.body, fontSize: 7.5, marginTop: 1 },

  galleryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 2 },
  galleryCell: { width: "33%", flexGrow: 1, position: "relative" },
  galleryCount: { position: "absolute", top: 6, left: 6, backgroundColor: "rgba(0,0,0,0.45)", paddingHorizontal: 7, paddingVertical: 2, borderRadius: 4 },
  galleryCountText: { fontFamily: fontFamily.socialBold, fontSize: 8, color: "#fff" },

  post: { paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1 },
  postHead: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 9 },
  postNameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  postName: { fontFamily: fontFamily.socialBold, fontSize: 13 },
  postBadge: { paddingHorizontal: 7, paddingVertical: 1.5, borderRadius: 999 },
  postBadgeText: { fontFamily: fontFamily.socialExtrabold, fontSize: 8 },
  postHandle: { fontFamily: fontFamily.body, fontSize: 10, marginTop: 1 },
  postText: { fontFamily: fontFamily.body, fontSize: 12.5, lineHeight: 19, marginBottom: 10 },
  postCard: { height: 140, borderRadius: 12, overflow: "hidden", alignItems: "center", justifyContent: "center" },
  postActions: { flexDirection: "row", gap: 22, marginTop: 10 },
  postAction: { fontFamily: fontFamily.bodySemibold, fontSize: 11.5 },

  ratingSummary: { flexDirection: "row", alignItems: "center", gap: 20, paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1 },
  ratingBig: { alignItems: "center" },
  ratingNum: { fontFamily: fontFamily.socialExtrabold, fontSize: 38, lineHeight: 40 },
  ratingStars: { fontSize: 12, marginTop: 3, letterSpacing: 1 },
  ratingCount: { fontFamily: fontFamily.body, fontSize: 9.5, marginTop: 3 },
  barRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  barN: { fontFamily: fontFamily.body, fontSize: 10, width: 8 },
  barTrack: { flex: 1, height: 5, borderRadius: 3, overflow: "hidden" },
  barFill: { height: "100%" },
  barPct: { fontFamily: fontFamily.body, fontSize: 9.5, width: 26, textAlign: "right" },
  reviewFilters: { flexDirection: "row", gap: 8, paddingHorizontal: 16, paddingVertical: 11, borderBottomWidth: 1 },
  reviewChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999 },
  reviewChipText: { fontFamily: fontFamily.socialBold, fontSize: 11 },
  review: { paddingHorizontal: 18, paddingVertical: 14, borderBottomWidth: 1 },
  reviewHead: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  reviewHandle: { fontFamily: fontFamily.socialBold, fontSize: 12.5 },
  reviewStarsRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 },
  reviewTime: { fontFamily: fontFamily.body, fontSize: 10 },
  reviewText: { fontFamily: fontFamily.body, fontSize: 12.5, lineHeight: 19 },
});

function shadowSm() {
  return { shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 1 } as const;
}
