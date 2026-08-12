import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useOnlineStatus } from "../hooks/useOnlineStatus";
import theme from "../theme/tokens";
import { OfflineBanner } from "./OfflineBanner";

export function Screen({ children, onRefresh, refreshing = false, scroll = true }) {
  const online = useOnlineStatus();
  const content = scroll ? (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> : undefined
      }
    >
      {children}
    </ScrollView>
  ) : (
    <View style={styles.content}>{children}</View>
  );
  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
      <OfflineBanner online={online} />
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: theme.color.paper, flex: 1 },
  content: {
    flexGrow: 1,
    gap: theme.space[4],
    paddingBottom: theme.space[8],
    paddingHorizontal: theme.space[4],
    paddingTop: theme.space[4],
  },
});
