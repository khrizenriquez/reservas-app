import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import { themes } from "./tokens";

const ThemeContext = createContext(null);

export function ThemeProvider({ children, initialTheme }) {
  const systemTheme = useColorScheme() === "dark" ? "dark" : "light";
  const [theme, setTheme] = useState(initialTheme ?? systemTheme);
  const toggleTheme = useCallback(() => setTheme((current) => current === "dark" ? "light" : "dark"), []);
  const value = useMemo(() => ({ theme, colors: themes[theme], setTheme, toggleTheme }), [theme, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("ThemeProvider is required");
  return value;
}
