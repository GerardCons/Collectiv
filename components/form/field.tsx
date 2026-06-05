import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { forwardRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

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
 * Labeled text input matching the wireframes (uppercase label, bordered box,
 * optional helper/error and a right accessory). Shared across auth, edit
 * profile, settings, and the new-collection form.
 */
export const Field = forwardRef<TextInput, FieldProps>(function Field(
  { label, helper, error, rightAccessory, style, multiline, ...inputProps },
  ref,
) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.box,
          multiline && styles.boxMultiline,
          !!error && styles.boxError,
        ]}
      >
        <TextInput
          ref={ref}
          style={[styles.input, multiline && styles.inputMultiline, style]}
          placeholderTextColor={colors.textTertiary}
          multiline={multiline}
          {...inputProps}
        />
        {rightAccessory ? (
          <View style={styles.accessory}>{rightAccessory}</View>
        ) : null}
      </View>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : helper ? (
        <Text style={styles.helper}>{helper}</Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs },
  label: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    letterSpacing: 1,
    color: colors.textTertiary,
  },
  box: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
  },
  boxMultiline: { alignItems: "flex-start" },
  boxError: { borderColor: colors.danger },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: fontSize.md,
    color: colors.text,
  },
  inputMultiline: { minHeight: 96, textAlignVertical: "top" },
  accessory: { paddingLeft: spacing.sm },
  helper: { fontSize: fontSize.xs, color: colors.textTertiary },
  error: { fontSize: fontSize.xs, color: colors.danger },
});
