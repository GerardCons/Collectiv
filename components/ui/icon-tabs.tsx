import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

export type IconTab<T extends string> = {
  key: T;
  icon: React.ComponentProps<typeof Ionicons>["name"];
};

/**
 * Instagram-style icon tab strip with a coral underline under the active tab.
 * Used on profile (Showcase / Listings / Activity / Reviews) and storefronts.
 */
export function IconTabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: IconTab<T>[];
  value: T;
  onChange: (v: T) => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={[styles.row, { borderBottomColor: colors.borderDefault }]}>
      {tabs.map((t) => {
        const on = t.key === value;
        return (
          <Pressable key={t.key} style={styles.tab} onPress={() => onChange(t.key)}>
            <Ionicons
              name={t.icon}
              size={22}
              color={on ? colors.primary : colors.tabBarInactive}
            />
            <View
              style={[
                styles.underline,
                { backgroundColor: on ? colors.primary : "transparent" },
              ]}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", borderBottomWidth: 1 },
  tab: { flex: 1, alignItems: "center", paddingTop: 12, gap: 10 },
  underline: { height: 2, width: "55%", borderRadius: 2 },
});
