import { StyleSheet, Text, View } from "react-native";

import theme from "../theme/tokens";

export function PageHeader({ eyebrow, title, description, action }) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.copy}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text accessibilityRole="header" style={styles.title}>{title}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: theme.space[3] },
  copy: { gap: theme.space[1] },
  eyebrow: {
    color: theme.color.blue,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  title: { color: theme.color.navy, fontFamily: "serif", fontSize: 34, fontWeight: "700" },
  description: { color: theme.color.muted, fontSize: 15, lineHeight: 22 },
});
