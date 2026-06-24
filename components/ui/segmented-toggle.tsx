import { fontFamily, fontSizes, radii, shadows, space } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Pressable, StyleSheet, Text, View } from "react-native";

export type SegmentedOption<T extends string> = { value: T; label: string };

/**
 * Segmented control on a recessed track; the active segment lifts to a card
 * surface with coral text + a soft shadow. Used for Buy/Trade, Groups/Events,
 * and similar two-or-more-way toggles.
 */
export function SegmentedToggle<T extends string>({
  options,
  value,
  onChange,
}: {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (v: T) => void;
}) {
  const { colors } = useTheme();
  return (
    <View
      style={[styles.track, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}
    >
      {options.map((opt) => {
        const on = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[
              styles.segment,
              on && [styles.segmentOn, { backgroundColor: colors.bgBase }],
            ]}
          >
            <Text
              style={[
                styles.text,
                { color: on ? colors.primary : colors.fgTertiary },
              ]}
              numberOfLines={1}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    gap: space.xs,
    padding: space.xs,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  segment: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: radii.md - 2,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentOn: { ...shadows.sm },
  text: { fontFamily: fontFamily.bodyBold, fontSize: fontSizes.sm },
});
