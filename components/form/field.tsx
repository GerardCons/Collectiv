import { fontFamily, fontSizes, radii, space } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { forwardRef, useState } from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

type FieldProps = TextInputProps & {
  /** Uppercase label above the field (e.g. "EMAIL"). */
  label: string;
  /** Grey helper text under the field. */
  helper?: string;
  /** Red error text under the field (replaces helper when present). */
  error?: string;
  /** Right-aligned control inside the field box — e.g. a password "show" toggle. */
  rightAccessory?: React.ReactNode;
};

/**
 * Labeled text input (Coral Core): surface fill, 1.5px border that turns coral
 * on focus / red on error, uppercase DM Sans label. Shared across auth, edit
 * profile, settings, and the new-collection form.
 */
export const Field = forwardRef<TextInput, FieldProps>(function Field(
  { label, helper, error, rightAccessory, style, multiline, onFocus, onBlur, ...inputProps },
  ref,
) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? colors.error
    : focused
      ? colors.primary
      : colors.borderDefault;

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: colors.fgSecondary }]}>{label}</Text>
      <View
        style={[
          styles.box,
          multiline && styles.boxMultiline,
          { backgroundColor: colors.bgSurface, borderColor },
        ]}
      >
        <TextInput
          ref={ref}
          style={[styles.input, multiline && styles.inputMultiline, { color: colors.fgPrimary }, style]}
          placeholderTextColor={colors.fgTertiary}
          multiline={multiline}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...inputProps}
        />
        {rightAccessory ? <View style={styles.accessory}>{rightAccessory}</View> : null}
      </View>
      {error ? (
        <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
      ) : helper ? (
        <Text style={[styles.helper, { color: colors.fgTertiary }]}>{helper}</Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { gap: 7 },
  label: {
    fontFamily: fontFamily.bodyBold,
    fontSize: fontSizes.xs,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  box: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: radii.lg,
    paddingHorizontal: space.lg,
  },
  boxMultiline: { alignItems: "flex-start" },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontFamily: fontFamily.body,
    fontSize: fontSizes.base,
  },
  inputMultiline: { minHeight: 96, textAlignVertical: "top", paddingTop: 12 },
  accessory: { paddingLeft: space.sm },
  helper: { fontFamily: fontFamily.body, fontSize: fontSizes.xs },
  error: { fontFamily: fontFamily.body, fontSize: fontSizes.xs, marginTop: -3 },
});
