import { Pressable, StyleSheet, Text, View } from "react-native";
import { useLanguage } from "../i18n/LanguageProvider";
import { radius, spacing } from "../theme/tokens";
import { useTheme } from "../theme/ThemeProvider";

const routeKeyFor = (name) => name === "index" ? "home" : name;

export function MobileTabBar({ navigation, state }) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const styles = makeStyles(colors);
  return <View accessibilityRole="tablist" style={styles.bar}>
    {state.routes.map((route, index) => {
      const key = routeKeyFor(route.name);
      const selected = state.index === index;
      return <Pressable key={route.key} accessibilityRole="tab" accessibilityLabel={t(`navigation.${key}`)} accessibilityState={{ selected }} onPress={() => {
        const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
        if (!selected && !event.defaultPrevented) navigation.navigate(route.name);
      }} style={[styles.item, selected && styles.selected]}>
        <View style={[styles.tick, selected && styles.tickSelected]} />
        <Text numberOfLines={1} style={[styles.label, selected && styles.labelSelected]}>{t(`navigation.${key}`)}</Text>
      </Pressable>;
    })}
  </View>;
}

const makeStyles = (colors) => StyleSheet.create({
  bar: { backgroundColor: colors.surface, borderTopColor: colors.border, borderTopWidth: 1, flexDirection: "row", minHeight: 72, paddingHorizontal: spacing.micro, paddingTop: spacing.micro },
  item: { alignItems: "center", flex: 1, gap: spacing.micro, justifyContent: "center", minHeight: 60, paddingHorizontal: 2 },
  selected: { backgroundColor: colors.control, borderRadius: radius.control },
  tick: { backgroundColor: "transparent", height: 3, width: 20 },
  tickSelected: { backgroundColor: colors.action },
  label: { color: colors.textMuted, fontSize: 10, fontWeight: "600" },
  labelSelected: { color: colors.brand, fontWeight: "800" }
});
