import NetInfo from "@react-native-community/netinfo";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ConnectivityContext = createContext(null);
const networkIsOnline = (state) => Boolean(state.isConnected) && state.isInternetReachable !== false;
const subscribeToNetwork = (listener) => NetInfo.addEventListener((state) => listener(networkIsOnline(state)));

export function ConnectivityProvider({ children, initialOnline = true, subscribe = subscribeToNetwork }) {
  const [isOnline, setIsOnline] = useState(initialOnline);
  useEffect(() => subscribe(setIsOnline), [subscribe]);
  const value = useMemo(() => ({ isOnline }), [isOnline]);
  return <ConnectivityContext.Provider value={value}>{children}</ConnectivityContext.Provider>;
}

export function useConnectivity() {
  const value = useContext(ConnectivityContext);
  if (!value) throw new Error("ConnectivityProvider is required");
  return value;
}
