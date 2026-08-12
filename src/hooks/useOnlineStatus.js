import { useNetworkState } from "expo-network";

export function useOnlineStatus() {
  const network = useNetworkState();
  return network.isConnected !== false && network.isInternetReachable !== false;
}
