import { AccessibilityInfo, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useEffect } from "react";
import { useReducedMotion } from "../accessibility/useReducedMotion";
import { useLanguage } from "../i18n/LanguageProvider";
import { radius, spacing } from "../theme/tokens";
import { useTheme } from "../theme/ThemeProvider";

export function AccessibleDialog({ children, onClose, title, visible }) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const reducedMotion = useReducedMotion();
  const styles = makeStyles(colors);
  useEffect(() => { if (visible) AccessibilityInfo.announceForAccessibility?.(title); }, [title, visible]);
  return <Modal accessibilityViewIsModal animationType={reducedMotion ? "none" : "fade"} onRequestClose={onClose} transparent visible={visible}>
    <View style={styles.backdrop}>
      <View accessibilityLiveRegion="polite" accessibilityRole="alert" accessibilityLabel={title} style={styles.dialog}>
        <View style={styles.rail} />
        <View style={styles.content}>
          <Text accessibilityRole="header" style={styles.title}>{title}</Text>
          {children}
          <Pressable accessibilityRole="button" accessibilityLabel={t("common.close")} onPress={onClose} style={styles.close}><Text style={styles.closeText}>{t("common.close")}</Text></Pressable>
        </View>
      </View>
    </View>
  </Modal>;
}

const makeStyles = (colors) => StyleSheet.create({
  backdrop: { alignItems: "center", backgroundColor: "rgba(8, 18, 30, 0.56)", flex: 1, justifyContent: "center", padding: spacing.section },
  dialog: { backgroundColor: colors.surfaceRaised, borderRadius: radius.dialog, flexDirection: "row", maxWidth: 480, overflow: "hidden", width: "100%" },
  rail: { backgroundColor: colors.brand, width: 10 },
  content: { flex: 1, gap: spacing.control, padding: spacing.section },
  title: { color: colors.ink, fontSize: 21, fontWeight: "700" },
  close: { alignSelf: "flex-end", justifyContent: "center", minHeight: 44, paddingHorizontal: spacing.control },
  closeText: { color: colors.action, fontWeight: "700" }
});
