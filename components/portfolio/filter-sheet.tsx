import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { fontFamily, fontSizes, radii, space } from "@/constants/theme";
import {
  CONDITION_OPTIONS,
  DEFAULT_FILTERS,
  GENRE_OPTIONS,
  GRADING_OPTIONS,
  PortfolioFilters,
  STATUS_OPTIONS,
} from "@/lib/portfolio-mock";
import { useTheme } from "@/hooks/use-theme";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

/** Filter sheet (F_Sheet) — Status / Genre / Condition / Grading multi-section. */
export function FilterSheet({
  visible,
  onClose,
  filters,
  onApply,
}: {
  visible: boolean;
  onClose: () => void;
  filters: PortfolioFilters;
  onApply: (f: PortfolioFilters) => void;
}) {
  const { colors } = useTheme();
  const [draft, setDraft] = useState<PortfolioFilters>(filters);

  // Sync the draft to the live filters whenever the sheet opens.
  useEffect(() => {
    if (visible) setDraft(filters);
  }, [visible, filters]);

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.head}>
        <Text style={[styles.title, { color: colors.fgPrimary }]}>Filter Cards</Text>
        <Pressable onPress={() => setDraft(DEFAULT_FILTERS)} hitSlop={8}>
          <Text style={[styles.reset, { color: colors.primary }]}>Reset All</Text>
        </Pressable>
      </View>

      <Section label="Status">
        {STATUS_OPTIONS.map((o) => (
          <Chip key={o.label} label={o.label} active={draft.status === o.value} onPress={() => setDraft((d) => ({ ...d, status: o.value }))} />
        ))}
      </Section>

      <Section label="Genre">
        {GENRE_OPTIONS.map((g) => (
          <Chip key={g} label={g} tone="social" active={draft.genre === g} onPress={() => setDraft((d) => ({ ...d, genre: d.genre === g ? null : g }))} />
        ))}
      </Section>

      <Section label="Condition">
        {CONDITION_OPTIONS.map((c) => (
          <Chip key={c} label={c} active={draft.condition === c} onPress={() => setDraft((d) => ({ ...d, condition: c }))} />
        ))}
      </Section>

      <Section label="Grading">
        {GRADING_OPTIONS.map((g) => (
          <Chip key={g} label={g} active={draft.grading === g} onPress={() => setDraft((d) => ({ ...d, grading: g }))} />
        ))}
      </Section>

      <Button
        title="Apply Filters"
        onPress={() => {
          onApply(draft);
          onClose();
        }}
        style={{ marginTop: space.xl }}
      />
    </BottomSheet>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={styles.section}>
      <Text style={[styles.label, { color: colors.fgTertiary }]}>{label}</Text>
      <View style={styles.chips}>{children}</View>
    </View>
  );
}

function Chip({
  label,
  active,
  onPress,
  tone = "primary",
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  tone?: "primary" | "social";
}) {
  const { colors } = useTheme();
  const accent = tone === "social" ? colors.secondary : colors.primary;
  const tint = tone === "social" ? colors.secondaryMuted : colors.primaryMuted;
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        { backgroundColor: active ? tint : colors.bgSurface, borderColor: active ? accent : colors.borderDefault },
      ]}
    >
      <Text style={[styles.chipText, { color: active ? accent : colors.fgSecondary }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: space.xs },
  title: { fontFamily: fontFamily.socialBold, fontSize: 17 },
  reset: { fontFamily: fontFamily.socialBold, fontSize: 12 },
  section: { marginTop: space.lg },
  label: { fontFamily: fontFamily.bodyBold, fontSize: fontSizes.xs, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 8 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: { paddingHorizontal: 11, paddingVertical: 5, borderRadius: radii.full, borderWidth: 1 },
  chipText: { fontFamily: fontFamily.socialSemibold, fontSize: 10 },
});
