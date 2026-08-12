import { Tabs } from "expo-router";
import { StyleSheet, Text } from "react-native";

import theme from "../../../theme/tokens";

const markers = Object.freeze({
  index: "H",
  availability: "D",
  reservations: "R",
  profile: "P",
});

function TabMarker({ name, color }) {
  return <Text style={[styles.marker, { color }]}>{markers[name]}</Text>;
}

function options(name, title) {
  return {
    title,
    tabBarAccessibilityLabel: title,
    tabBarIcon: ({ color }) => <TabMarker color={color} name={name} />,
  };
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.color.blue,
        tabBarInactiveTintColor: theme.color.muted,
        tabBarLabelStyle: styles.label,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen name="index" options={options("index", "Inicio")} />
      <Tabs.Screen name="availability" options={options("availability", "Disponible")} />
      <Tabs.Screen name="reservations" options={options("reservations", "Reservas")} />
      <Tabs.Screen name="profile" options={options("profile", "Perfil")} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: { backgroundColor: theme.color.surface, borderTopColor: theme.color.border, height: 72, paddingBottom: 8, paddingTop: 7 },
  label: { fontSize: 10, fontWeight: "700" },
  marker: { fontFamily: "monospace", fontSize: 17, fontWeight: "900" },
});
